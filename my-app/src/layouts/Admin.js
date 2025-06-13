import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "components/ErrorBoundary/ErrorBoundary.js";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import Dashboard from "views/admin/Dashboard.js";
import GererCours from "views/admin/GererCours";
import Tables from "views/admin/Tables.js";
import Niveau from "views/admin/Niveau.js";
import Chapitre from "views/admin/Chapitre.js";
import MesCours from "views/admin/MesCours.js";
import ListCours from "views/admin/ListCours.js";
import Utilisateurs from "views/admin/Utilisateurs.js";
import AjouterElementCours from "views/admin/AjouterElementCours";
import AjouterEspaceCours from "views/admin/AjouterEspaceCours";
import ModifierCoursPage from "views/admin/editEspaceCour";
import Profile from "views/admin/Profile.js";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full pt-12 md:pt-20 -mt-20 md:-mt-16"> {/* Adjusted padding and margin */}          <Routes>
            <Route
              path="dashboard"
              element={<Dashboard />}
              errorElement={<ErrorBoundary />}
            />
            {/* Redirect nested enseignant/apprenant under admin to top-level routes */}
            <Route path="enseignant" element={<Navigate to="/enseignant" replace />} />
            <Route path="apprenant" element={<Navigate to="/apprenant" replace />} />
            <Route path="AjouterCours" element={<GererCours />} />
            <Route path="tables" element={<Tables />} />
            <Route
              path="AjouterElementCours"
              element={<AjouterElementCours />}
            />
            <Route path="AjouterEspaceCours" element={<AjouterEspaceCours />} />
            <Route path="ModifierCoursPage" element={<ModifierCoursPage />} /> {/* Reverted route */}

            <Route path="listusers" element={<Utilisateurs />} />            <Route path="mescours" element={<MesCours />} />
            <Route path="ListCours/idespac" element={<ListCours />} />            <Route path="niveaux" element={<Niveau />} />
            <Route path="chapitre" element={<Chapitre />} />
            <Route path="profile" element={<Profile />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
