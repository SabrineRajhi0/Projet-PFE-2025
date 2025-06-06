import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import "assets/styles/courseManagement.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import Choisir from 'views/Choisir.js';

import { AuthProvider } from "./views/auth/AuthContext.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Enseignant from "views/Enseignant/index.js";
import Apprenant from "views/Apprenant/index.js";

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

        {/* add routes without layouts */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Index />} />
        <Route path="/choisir" element={<Choisir />} />

        {/* catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </AuthProvider>
  </BrowserRouter>
);
