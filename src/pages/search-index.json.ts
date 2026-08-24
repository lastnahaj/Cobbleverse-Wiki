import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { staticSearchEntries } from "../data/staticPages";
import { contentPath, withBase } from "../lib/basePath";

function cleanMarkdown(value: string): string {
  return value
    .replace(/^---[\s\S]*?---/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const prerender = true;

export const GET: APIRoute = async () => {
  const docs = await getCollection(
    "docs",
    ({ data }) => data.status === "published",
  );
  const contentEntries = docs.map((entry) => {
    const body = entry.body ?? "";
    const headings = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((match) =>
      cleanMarkdown(match[1]),
    );
    const plainBody = cleanMarkdown(body);
    return {
      title: entry.data.title,
      description: entry.data.description,
      category: entry.data.category,
      headings,
      excerpt: plainBody.slice(0, 260),
      tags: entry.data.tags,
      aliases: entry.data.aliases,
      url: contentPath(entry.id),
    };
  });
  const structuredEntries = staticSearchEntries.map((entry) => ({
    ...entry,
    url: withBase(entry.path),
    path: undefined,
  }));
  return new Response(
    JSON.stringify([...contentEntries, ...structuredEntries]),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
};
