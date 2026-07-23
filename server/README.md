# Backend setup

Learner registration works only when the Express server is running with a valid `.env`.

1. Copy `.env.example` to `.env`.
2. Put the real MongoDB password in `MONGODB_URI`.
3. Set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Run `npm run server`.
5. In another terminal run `npm run dev`.

Health check:

```txt
http://127.0.0.1:4000/api/health
```

If learner registration fails, the frontend now shows the real API error message.
