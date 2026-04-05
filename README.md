# Ticket Management Frontend

## Structure

- `src/app` - root application bootstrap
- `src/components` - reusable React UI building blocks
- `src/context` - authentication context
- `src/layouts` - sidebar/header layout
- `src/pages/auth` - login page
- `src/pages/dashboard` - admin, technician, and customer dashboards
- `src/pages/tickets` - ticket list, create, on-behalf, details, edit
- `src/pages/users` - create/list customers and technicians
- `src/pages/masters` - category, priority, status pages
- `src/services` - axios client, auth/session helpers, API wrappers
- `src/theme` - Material UI theme

## Tech Stack

- React 18
- Vite
- Material UI
- React Router
- Axios with JWT + refresh token handling
- Chart.js / react-chartjs-2

## Run Frontend

Install Node.js 20+ first if it is not already available.

From `Frontend/`:

```powershell
npm install
npm start
```

Frontend URL:

- `http://localhost:5173`

## API Proxy

The Vite dev server proxies `/api` requests to `http://localhost:5000` through [vite.config.js](/C:/Users/DivyaPriya/Documents/New%20project%202/Frontend/vite.config.js).
