/** Joins the deployment base (e.g. "/glosuj") and an app path. */
export function withBase(base: string, path: string): string {
  const prefix = base.replace(/\/+$/, "");
  if (path === "") return prefix || "/";
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
}

/** App-internal URL, e.g. url("/login") -> "/glosuj/login". */
export function url(path: string): string {
  return withBase(import.meta.env.BASE_URL, path);
}

/** Path to scope cookies to the app: "/glosuj" (not the whole domain). */
export function basePath(): string {
  return withBase(import.meta.env.BASE_URL, "");
}
