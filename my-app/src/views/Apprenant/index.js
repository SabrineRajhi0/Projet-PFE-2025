import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import React, { useContext } from "react";
import { AuthContext } from "views/auth/AuthContext.js";
import { Navigate } from "react-router-dom";
import CardCours from "components/Cards/CardCours.js";

export default function Apprenant() {
  const { user, loading } = useContext(AuthContext);

  // Redirect if user is not an Apprenant
  if (!loading && (!user || !Array.isArray(user.roles) || !user.roles.includes("ROLE_APPRENANT"))) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return null;
  }
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
