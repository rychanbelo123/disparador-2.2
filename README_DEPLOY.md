# Deploy Instructions for Production

## Backend

1. Configure environment variables in `backend/.env.production`:

```
STRIPE_SECRET_KEY=sk_live_your_real_secret_key_here
PORT=3000
```

2. Build backend:

```bash
cd backend
npm install
npx tsc
```

3. Start backend:

```bash
node dist/server.js
```

Make sure your backend is accessible publicly at a URL (e.g., https://your-backend.com).

## Frontend

1. Configure environment variables in `.env.production`:

```
VITE_BACKEND_URL=https://your-backend.com
```

2. Build frontend:

```bash
npm install
npm run build
```

3. Serve the `dist` folder with a static server (nginx, Vercel, Netlify, etc).

## Notes

- The frontend will call the backend API at `VITE_BACKEND_URL/api/create-payment-intent`.
- Make sure CORS is properly configured on backend to allow frontend origin.
- Keep your Stripe secret key private and never expose it in frontend code.

---

If you want, I can help you create Dockerfiles for both backend and frontend for easier deployment. Would you like that?