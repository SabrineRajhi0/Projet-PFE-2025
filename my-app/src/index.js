import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "assets/styles/courseManagement.css";
import "assets/styles/tableDropdown.css";
import "assets/styles/pagination-override.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import Choisir from "views/Choisir.js";

import { AuthProvider } from "./views/auth/AuthContext.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Enseignant from "views/Enseignant/index.js";
import Apprenant from "views/Apprenant/index.js";
import ViewCours from "views/Apprenant/ViewCours.js";
import QuizPage from "views/QuizPage.js";
import NotFoundPage from "views/PageNotFound/NotFoundPage.js";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Index />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/auth/*",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Auth />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/admin/*",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Admin />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/enseignant",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Enseignant />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/apprenant",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Apprenant />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/apprenant/cours/:id",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <ViewCours />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/landing",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Landing />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/profile",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Profile />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/choisir",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <Choisir />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "/quiz",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <QuizPage />
          </>
        </AuthProvider>
      ),
    },
    {
      path: "*",
      element: (
        <AuthProvider>
          <>
            <ToastContainer />
            <NotFoundPage />
          </>
        </AuthProvider>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const root = createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router={router} />
);
