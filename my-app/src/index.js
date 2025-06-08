import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* add routes with layouts: all /admin/* routes go through Admin layout */}
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/admin/*" element={<Admin />} />

        {/* standalone dashboards for Enseignant & Apprenant */}
        <Route path="/enseignant" element={<Enseignant />} />
        <Route path="/apprenant" element={<Apprenant />} />
        <Route path="/apprenant/cours/:id" element={<ViewCours />} />

        {/* add routes without layouts */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Index />} />
        <Route path="/choisir" element={<Choisir />} />

        <Route path="/quiz" element={<QuizPage />} />
        {/* catch-all route */}
        <Route path="*" exact={true} element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </AuthProvider>
  </BrowserRouter>
);
