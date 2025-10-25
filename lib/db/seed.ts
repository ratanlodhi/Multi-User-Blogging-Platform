import { db } from './client';
import { posts, categories, postCategories } from './schema';

const sampleCategories = [
  {
    name: 'Technology',
    description: 'Articles about the latest in tech, programming, and software development',
    slug: 'technology',
  },
  {
    name: 'Travel',
    description: 'Travel guides, tips, and destination recommendations',
    slug: 'travel',
  },
  {
    name: 'Food',
    description: 'Recipes, restaurant reviews, and culinary adventures',
    slug: 'food',
  },
  {
    name: 'Lifestyle',
    description: 'Tips and insights on living your best life',
    slug: 'lifestyle',
  },
];

const samplePosts = [
  {
    title: 'Getting Started with Next.js 15 and tRPC',
    slug: 'getting-started-nextjs-15-trpc',
    content: `# Getting Started with Next.js 15 and tRPC

Next.js 15 brings exciting new features and improvements. Combined with tRPC, you can build fully type-safe applications from end to end.

## What is tRPC?

tRPC is a framework for building type-safe APIs in TypeScript. It leverages TypeScript's powerful type system to provide automatic type inference across your client and server.

## Key Benefits

- **End-to-end type safety**: No code generation needed
- **Developer experience**: Autocomplete and type errors in your IDE
- **Performance**: Minimal overhead and excellent performance
- **Simple to use**: Easy to set up and integrate

## Installation

\`\`\`bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
\`\`\`

## Creating Your First Router

\`\`\`typescript
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
  hello: t.procedure.query(() => {
    return 'Hello from tRPC!';
  }),
});
\`\`\`

Happy coding!`,
    status: 'published' as const,
  },
  {
    title: 'Top 10 Travel Destinations for 2025',
    slug: 'top-10-travel-destinations-2025',
    content: `# Top 10 Travel Destinations for 2025

Planning your next adventure? Here are the must-visit destinations for 2025.

## 1. Iceland

Known for its stunning natural beauty, from the Northern Lights to geothermal hot springs.

### Why Visit
- Unique landscapes
- Adventure activities
- Rich Viking history

## 2. Japan

A perfect blend of ancient traditions and cutting-edge technology.

## 3. New Zealand

Home to breathtaking scenery and outdoor adventures.

## 4. Portugal

Beautiful beaches, historic cities, and delicious cuisine.

## 5. Costa Rica

Eco-tourism paradise with incredible biodiversity.

## Planning Tips

1. Book flights early for better deals
2. Research visa requirements
3. Learn basic local phrases
4. Pack according to the season

> "Travel is the only thing you buy that makes you richer" - Anonymous

Start planning your adventure today!`,
    status: 'published' as const,
  },
  {
    title: 'The Perfect Homemade Pizza Recipe',
    slug: 'perfect-homemade-pizza-recipe',
    content: `# The Perfect Homemade Pizza Recipe

Learn how to make authentic Italian-style pizza at home.

## Ingredients

### For the Dough
- 500g bread flour
- 325ml warm water
- 10g salt
- 7g active dry yeast
- 15ml olive oil

### For the Topping
- 200g San Marzano tomatoes
- 200g fresh mozzarella
- Fresh basil leaves
- Extra virgin olive oil
- Salt to taste

## Instructions

### 1. Make the Dough

Mix the yeast with warm water and let it activate for 5 minutes.

### 2. Knead

Combine flour and salt, add the yeast mixture, and knead for 10 minutes.

### 3. Rest

Let the dough rise for at least 2 hours at room temperature.

### 4. Shape

Gently stretch the dough into a 12-inch circle.

### 5. Top and Bake

Add your toppings and bake at 500°F (260°C) for 10-12 minutes.

**Pro tip**: Use a pizza stone for the best results!

Enjoy your homemade pizza!`,
    status: 'published' as const,
  },
  {
    title: '5 Productivity Hacks for Remote Workers',
    slug: '5-productivity-hacks-remote-workers',
    content: `# 5 Productivity Hacks for Remote Workers

Working from home can be challenging. Here are 5 proven strategies to boost your productivity.

## 1. Create a Dedicated Workspace

Having a specific area for work helps you maintain focus and separate work from personal life.

## 2. Follow a Consistent Schedule

Stick to regular working hours to maintain work-life balance.

## 3. Take Regular Breaks

Use the Pomodoro Technique:
- Work for 25 minutes
- Take a 5-minute break
- Repeat 4 times
- Take a longer 15-30 minute break

## 4. Minimize Distractions

- Turn off non-essential notifications
- Use website blockers during focus time
- Communicate your working hours to family

## 5. Stay Connected

Regular video calls with colleagues help maintain team cohesion.

| Tool | Purpose | Rating |
|------|---------|--------|
| Slack | Communication | ⭐⭐⭐⭐⭐ |
| Zoom | Video calls | ⭐⭐⭐⭐ |
| Notion | Organization | ⭐⭐⭐⭐⭐ |

These simple changes can dramatically improve your remote work experience!`,
    status: 'published' as const,
  },
  {
    title: 'Understanding TypeScript Generics',
    slug: 'understanding-typescript-generics',
    content: `# Understanding TypeScript Generics

Generics are one of the most powerful features in TypeScript. Let's dive deep into how they work.

## What are Generics?

Generics allow you to write reusable, type-safe code that works with multiple types.

## Basic Example

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("hello");
const number = identity<number>(42);
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };
\`\`\`

## Constraints

\`\`\`typescript
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(arg: T): number {
  return arg.length;
}
\`\`\`

Generics make your code more flexible and maintainable!`,
    status: 'draft' as const,
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    console.log('Creating categories...');
    const insertedCategories = await db
      .insert(categories)
      .values(sampleCategories)
      .returning();
    console.log(`✅ Created ${insertedCategories.length} categories`);

    console.log('Creating posts...');
    const insertedPosts = await db
      .insert(posts)
      .values(samplePosts)
      .returning();
    console.log(`✅ Created ${insertedPosts.length} posts`);

    console.log('Linking posts to categories...');
    const postCategoryLinks = [
      { postId: insertedPosts[0].id, categoryId: insertedCategories[0].id },
      { postId: insertedPosts[1].id, categoryId: insertedCategories[1].id },
      { postId: insertedPosts[2].id, categoryId: insertedCategories[2].id },
      {
        postId: insertedPosts[3].id,
        categoryId: insertedCategories[3].id,
      },
      { postId: insertedPosts[4].id, categoryId: insertedCategories[0].id },
    ];

    await db.insert(postCategories).values(postCategoryLinks);
    console.log(`✅ Created ${postCategoryLinks.length} post-category links`);

    console.log('✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed();
