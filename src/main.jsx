import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.jsx"

import HomePage from "./pages/HomePage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import CommunityPage from "./pages/community/CommunityPage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"

import MessagesPage from "./pages/MessagesPage.jsx"

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"

import DashboardPage from "./pages/market/DashboardPage.jsx"
import MyPublicationsPage from "./pages/market/MyPublicationsPage.jsx"
import CreatePublicationPage from "./pages/market/CreatePublicationPage.jsx"
import PostDetailPlaceholder from "./pages/community/PostDetailPlaceholder.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      // { path: "/community", element: <CommunityPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/community/post/:id", element: <PostDetailPlaceholder /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/marketplace", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/messages", element: <MessagesPage /> },
          { path: "/marketplace/create", element: <CreatePublicationPage /> },
          { path: "/marketplace/my-publications", element: <MyPublicationsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)