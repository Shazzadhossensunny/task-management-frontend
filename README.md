# Task Management Frontend

This is the frontend application of the **Task Management System**, built with React, TypeScript, Redux Toolkit, Tailwind CSS, and Vite. The app allows users to register, login, create and manage tasks efficiently.

## 🚀 Live Demo

🔗 [Live Site](https://task-management-frontend-kappa-kohl.vercel.app)

## 🏗️ Tech Stack

- **React 19 + TypeScript**
- **Vite 6**
- **Redux Toolkit + RTK Query + Redux Persist**
- **Tailwind CSS 3 + tailwind-animate**
- **React Hook Form + Zod** (for form validation)
- **Lucide Icons**
- **Sonner** (for toast notifications)
- **Protected Routes** via React Router v7 + JWT

## 🔒 Protected Routes

Routes such as:

```
/dashboard
/create-task
/task-details/:id
```

are protected using a custom **PrivateRoute** component. Users must be authenticated to access these routes; otherwise, they are redirected to the **Login page**.

Example (Private Route):

```tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  return accessToken ? children : <Navigate to="/login" replace />;
};
```

## 🧩 Features

- 🔐 JWT Authentication
- 🔄 Auto-login using Redux Persist
- 📝 Task Create / Edit / Delete
- 🔍 Single Task View
- 🎨 Tailwind + Lucide UI Components
- ✅ Protected Dashboard Routes

## ⚙️ Scripts

```bash
pnpm install       # install dependencies
pnpm run dev      # start dev server (http://localhost:5173)
pnpm run build    # build production files
pnpm run preview  # preview production build
```

## 🌐 Backend API

This frontend connects to the live backend:

🔗 [Backend Live Link](https://task-management-backend-alpha.vercel.app)

Health Check: [https://task-management-backend-alpha.vercel.app/api/health](https://task-management-backend-alpha.vercel.app/api/health)

Backend Repo: [https://github.com/Shazzadhossensunny/task-management-backend](https://github.com/Shazzadhossensunny/task-management-backend)
