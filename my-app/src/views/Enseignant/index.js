import React, { useContext } from "react";
import { AuthContext } from "views/auth/AuthContext.js";
import { Navigate } from "react-router-dom";
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import CardCours from "components/Cards/CardCours.js";

export default function Enseignant() {
  const { user, loading } = useContext(AuthContext);

  // Redirect if user is not an Enseignant
  if (!loading && (!user || !Array.isArray(user.roles) || !user.roles.includes("ROLE_ENSEIGNANT"))) {
    return <Navigate to="/" replace />;
  }

  // While auth state is loading, don't render or redirect
  if (loading) {
    return null;
  }
  // Show courses table for enseignant once loaded
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
        <AdminNavbar />
        <div className="px-4 md:px-10 mx-auto w-full pt-12 md:pt-20 pb-10">
          <CardCours />
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
