import { z } from 'zod';
import { router, publicProcedure } from '../init';
import { posts, postCategories, categories } from '@/lib/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  categoryIds: z.array(z.string().uuid()).optional(),
});

const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

const listPostsSchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  categoryId: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export const postsRouter = router({
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const slug = input.slug || slugify(input.title);

      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (existingPost) {
        throw new Error('A post with this slug already exists');
      }

      const [post] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          slug,
          status: input.status,
          updatedAt: new Date(),
        })
        .returning();

      if (input.categoryIds && input.categoryIds.length > 0) {
        await ctx.db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: post.id,
            categoryId,
          }))
        );
      }

      return post;
    }),

  list: publicProcedure
    .input(listPostsSchema)
    .query(async ({ ctx, input }) => {
      let query = ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          slug: posts.slug,
          status: posts.status,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.status) {
        query = query.where(eq(posts.status, input.status)) as typeof query;
      }

      if (input.categoryId) {
        const postIds = await ctx.db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, input.categoryId));

        if (postIds.length === 0) {
          return [];
        }

        const ids = postIds.map((p) => p.postId);
        query = query.where(inArray(posts.id, ids)) as typeof query;
      }

      return await query;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
      });

      if (!post) {
        throw new Error('Post not found');
      }

      const postCategoryRecords = await ctx.db
        .select({
          categoryId: postCategories.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(postCategories)
        .innerJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(postCategories.postId, post.id));

      return {
        ...post,
        categories: postCategoryRecords.map((c) => ({
          id: c.categoryId,
          name: c.categoryName,
          slug: c.categorySlug,
        })),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new Error('Post not found');
      }

      const postCategoryRecords = await ctx.db
        .select({
          categoryId: postCategories.categoryId,
        })
        .from(postCategories)
        .where(eq(postCategories.postId, post.id));

      return {
        ...post,
        categoryIds: postCategoryRecords.map((c) => c.categoryId),
      };
    }),

  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...updateData } = input;

      if (updateData.slug) {
        const existingPost = await ctx.db.query.posts.findFirst({
          where: and(eq(posts.slug, updateData.slug)),
        });

        if (existingPost && existingPost.id !== id) {
          throw new Error('A post with this slug already exists');
        }
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      if (!updatedPost) {
        throw new Error('Post not found');
      }

      if (categoryIds !== undefined) {
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, id));

        if (categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedPost] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!deletedPost) {
        throw new Error('Post not found');
      }

      return { success: true };
    }),
});
