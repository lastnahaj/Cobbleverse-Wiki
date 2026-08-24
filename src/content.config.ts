import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    order: z.number().int().default(100),
    tags: z.array(z.string()).default([]),
    aliases: z.array(z.string()).default([]),
    status: z.enum(["published", "draft", "archived"]),
    lastUpdated: z.coerce.date(),
    verified: z.boolean(),
    related: z.array(z.string()).default([]),
    hero: z.string().optional(),
  }),
});

export const collections = { docs };
