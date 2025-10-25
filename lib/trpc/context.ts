import { db } from '@/lib/db/client';

export async function createContext() {
  return {
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
