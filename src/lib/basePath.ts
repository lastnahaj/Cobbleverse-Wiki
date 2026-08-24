const base = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function withBase(path: string): string {
  if (/^(?:[a-z]+:|#)/i.test(path)) return path;
  const normalized = path.replace(/^\/+/, "");
  return normalized ? `${base}${normalized}` : base;
}

export function withoutBase(pathname: string): string {
  const baseWithoutSlash = base.replace(/\/$/, "");
  const stripped = pathname.startsWith(baseWithoutSlash)
    ? pathname.slice(baseWithoutSlash.length)
    : pathname;
  return stripped || "/";
}

export function contentPath(id: string): string {
  const normalized = id.replace(/\/index$/, "");
  return withBase(`/${normalized}/`);
}
