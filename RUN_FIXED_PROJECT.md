# How to Run the Fixed FreshCart Project

1. Open the project folder:

```bash
cd FreshCartt
```

2. Install dependencies:

```bash
npm run install-all
```

3. Start frontend and backend together:

```bash
npm run dev
```

4. Open the frontend:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:3000
```

## MongoDB note
The project now works even if MongoDB is not running by using a small local fallback JSON store for testing. For proper database storage, start MongoDB and then run:

```bash
npm run seed
```

## Important
Do not upload `node_modules` when submitting the project. Install dependencies with `npm run install-all` after extracting the ZIP.
