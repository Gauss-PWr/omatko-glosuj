# Omatko Głosuj 4.0

## Developing

Install dependencies with Bun, then start a development server:

```sh
bun install
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deployment

The app is served under `https://omatko.pwr.edu.pl/glosuj/` (`base: "/glosuj"` in
`astro.config.mjs`). Locally it is available at `http://localhost:4321/glosuj/`.

- The reverse proxy should forward `/glosuj/` to the app unchanged, e.g. nginx:

  ```nginx
  location /glosuj/ {
    proxy_pass http://127.0.0.1:4321;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  # live stats use Server-Sent Events: do not buffer them
  location /glosuj/api/stats/events {
    proxy_pass http://127.0.0.1:4321;
    proxy_buffering off;
  }
  ```

- The session cookie is scoped to `/glosuj`, so it is not sent to the rest of
  `omatko.pwr.edu.pl`.
- Use `url()` from `src/lib/url.ts` for every internal link, redirect and fetch
  so the base path is applied.

### Badge QR codes

A badge QR code should encode the login link with the badge code in the URL
fragment:

```
https://omatko.pwr.edu.pl/glosuj/login#<code>
```

The fragment is never sent to the server. The login page reads it, removes it
from the address bar and signs the user in with the normal login form.
