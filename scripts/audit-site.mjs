import { readFile, readdir, access } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
const root = join(process.cwd(), "dist");
async function files(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? files(join(dir, entry.name))
          : join(dir, entry.name),
      ),
    )
  ).flat();
}
const failures = [];
let count = 0;
for (const file of (await files(root)).filter((file) =>
  file.endsWith(".html"),
)) {
  const html = await readFile(file, "utf8");
  count++;
  if (
    /(?:href|src)="\/Cobbleverse-Wiki\//.test(html) ||
    html.includes('rel="canonical" href="https://lastnahaj.github.io')
  )
    failures.push(`${relative(root, file)}: stale public URL`);
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|data:|javascript:)/.test(value)) continue;
    const [path, fragment] = value.split("#");
    const resolved = path.startsWith("/")
      ? join(root, decodeURI(path.split("?")[0]))
      : path
        ? join(dirname(file), decodeURI(path.split("?")[0]))
        : file;
    const target =
      resolved.endsWith("/") || !resolved.split(/[\\/]/).pop().includes(".")
        ? join(resolved, "index.html")
        : resolved;
    try {
      await access(target);
      if (fragment && target.endsWith(".html")) {
        const targetHtml =
          target === file ? html : await readFile(target, "utf8");
        if (!targetHtml.includes(`id="${fragment}"`))
          failures.push(`${relative(root, file)}: missing anchor ${value}`);
      }
    } catch {
      failures.push(`${relative(root, file)}: missing ${value}`);
    }
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Audited ${count} pages: internal routes, anchors, images, and domain paths passed.`,
  );
