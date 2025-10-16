import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from './pages/Home.jsx'
import { AuthLayout, Login } from './components/index.js'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import AddPost from "./pages/Addpost.jsx";
import Signup from './pages/Signup'
import EditPost from "./pages/EditPost";
import OAuthCallback from './pages/OAuthCallback.jsx'
import Post from "./pages/Post";
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'

import AllPosts from "./pages/AllPosts";
import Settings from './pages/Settings.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home/>,

      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}> 
            <Login/>
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
            <AuthLayout authentication={false}>
                <Signup />
            </AuthLayout>
        ),
    },
    {
        path: "/all-posts",
        element: (
            <AuthLayout authentication>
                {" "}
                <AllPosts />
            </AuthLayout>
        ),
    },
    {
        path: "/add-post",
        element: (
            <AuthLayout authentication>
                {" "}
                <AddPost />
            </AuthLayout>
        ),
    },
    {
        path: "/edit-post/:slug",
        element: (
            <AuthLayout authentication>
                {" "}
                <EditPost />
            </AuthLayout>
        ),
    },
    {
        path: "/post/:slug",
        element: <Post />,
    },
    {
      path: "/oauth-callback",
      element: <OAuthCallback />
    },
     {
      path: "/profile",
      element: <Profile />
    },
     {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
        path: "/settings",
        element: <Settings />
        
        
    },
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
