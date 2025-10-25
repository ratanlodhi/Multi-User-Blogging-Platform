import { router } from './init';
import { postsRouter } from './routers/posts';
import { categoriesRouter } from './routers/categories';

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
