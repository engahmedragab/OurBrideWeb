import { authRoutes, protectedRoutes, publicRoutes } from '@/constants'
import { createBrowserRouter } from 'react-router-dom'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import AuthLayout from '@/pages/auth/AuthLayout'
import { AuthRoute, ProtectedRoute } from './ProtectedRoutes'
import Home from '@/pages/Home'
import Dashboard from '@/pages/dashboard'

export const routes = createBrowserRouter([
  // auth routes
  {
    path: '/auth',
    element: (
      <AuthRoute isAuthenticated={false}>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: authRoutes.LOGIN.slice(1),
        element: <Login />,
      },
      {
        path: authRoutes.REGISTER.slice(1),
        element: <Register />,
      },
    ],
  },
  // protected routes
  {
    path: protectedRoutes.DASHBOARD.slice(1),
    element: <ProtectedRoute isAuthenticated={false}> <Dashboard /> </ProtectedRoute>,
  },

  // public routes
  {
    path: publicRoutes.HOME.slice(1),
    element: <Home />,
  },
])
