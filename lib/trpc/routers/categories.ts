import { z } from 'zod';
import { router, publicProcedure } from '../init';
import { categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().optional(),
  slug: z.string().optional(),
});

const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const categoriesRouter = router({
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug || slugify(input.name);

      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });

      if (existingCategory) {
        throw new Error('A category with this slug already exists');
      }

      const [category] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          description: input.description,
          slug,
        })
        .returning();

      return category;
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),

  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      if (updateData.slug) {
        const existingCategory = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, updateData.slug),
        });

        if (existingCategory && existingCategory.id !== id) {
          throw new Error('A category with this slug already exists');
        }
      }

      const [updatedCategory] = await ctx.db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

      if (!updatedCategory) {
        throw new Error('Category not found');
      }

      return updatedCategory;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedCategory] = await ctx.db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();

      if (!deletedCategory) {
        throw new Error('Category not found');
      }

      return { success: true };
    }),
});
