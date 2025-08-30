# Edison POS — Web (React + Vite)

This is a direct conversion of your React Native POS to a web React app. The styles, screens and API calls remain the same where possible.

## Scripts
- `npm install`
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview the build

## Routes
- `/login`
- `/pos`
- `/scan-card`
- `/cash`
- `/history`

> API Base: `https://edison-qr.eagletechsolutions.co.uk/api`

### Notes
- Orientation locks and Expo-specific code were removed (not applicable on web).
- Toasts are implemented with a lightweight in-app component.
- `refreshData` is available on the store (alias of `loadData`) to match the original screen usage.


## CORS (Dev) — Important
The backend does not send `Access-Control-Allow-Origin`, so browsers block direct cross-origin calls.
This project sets up a **Vite dev proxy** so your calls go through `http://localhost`:

- In dev, API base defaults to `/api` which is proxied to `https://edison-qr.eagletechsolutions.co.uk`.
- Optionally set a custom base via `.env`:

```
VITE_API_BASE=/api
```

### Production
For production hosting, add a reverse proxy/rewrites so `/api` goes to your backend, e.g.

**Nginx**:
```
location /api/ {
  proxy_pass https://edison-qr.eagletechsolutions.co.uk/api/;
  proxy_set_header Host edison-qr.eagletechsolutions.co.uk;
  proxy_set_header X-Forwarded-Proto https;
}
```

**Vercel** (vercel.json):
```
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://edison-qr.eagletechsolutions.co.uk/api/$1" }
  ]
}
```
# qatar-pos-edison
