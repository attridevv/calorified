# Calorified

**Track. Fuel. Thrive.** A nutrition tracker with AI food lookup — describe a meal in plain words and get its calories and macros.

**Live:** https://calorified.vercel.app

![Calorified](https://attridevv.com/assets/work/calorified.jpg)

## Features

- Calorie and macro logging with an AI food lookup (OpenAI)
- Water intake and body stats
- Weekly trends and nutrition coaching
- Accounts and sign-in with Clerk

## Stack

Next.js (App Router) · TypeScript · Prisma + Postgres · Clerk · Recharts · Tailwind CSS · Zod

## Run locally

```sh
npm install
cp .env.example .env   # then fill in the values below
npm run db:push        # create the tables
npm run dev            # → http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `OPENAI_API_KEY` | AI food lookup |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Authentication |

---

Built by [Dev Attri](https://attridevv.com).
