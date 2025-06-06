/*eslint-disable*/
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "views/auth/AuthContext.js";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // normalize role
  const normalizedRole = user?.roles?.includes('ROLE_ADMIN')
    ? 'admin'
    : user?.roles?.includes('ROLE_ENSEIGNANT')
    ? 'enseignant'
    : user?.roles?.includes('ROLE_APPRENANT')
    ? 'apprenant'
    : null;

  const handleLogout = () => {
    // Ajoutez ici votre logique de déconnexion
    // Exemple: suppression du token, effacement du localStorage, etc.
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Redirection vers la page de connexion
    navigate("/auth/login");
  };

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          {/*  */}
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12"></div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Admin Layout Pages
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {normalizedRole === 'admin' && (
                <>
                  {/* Admin dashboard */}
                  <li className="items-center">
                    <Link
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.includes("/admin/dashboard")
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/dashboard"
                    >
                      <i
                        className={
                          "fas fa-tv mr-2 text-sm " +
                          (window.location.href.includes("/admin/dashboard")
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                      ></i>{" "}
                      Dashboard
                    </Link>
                  </li>
                  {/* Manage courses */}
                  <li className="items-center">
                    <Link
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.includes("/admin/settings")
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/settings"
                    >
                      <i
                        className={
                          "fas fa-tools mr-2 text-sm " +
                          (window.location.href.includes("/admin/settings")
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                      ></i>{" "}
                      GERER COURS
                    </Link>
                  </li>
                  <li className="items-center">
                    <Link
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.includes("/admin/tables")
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/tables"
                    >
                      <i
                        className={
                          "fas fa-table mr-2 text-sm " +
                          (window.location.href.includes("/admin/tables")
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                      ></i>{" "}
                      Utilisateurs
                    </Link>
                  </li>
                  <li className="items-center">
                    <Link
                      className={
                        "text-xs uppercase py-3 font-bold block " +
                        (window.location.href.includes("/admin/mescours")
                          ? "text-lightBlue-500 hover:text-lightBlue-600"
                          : "text-blueGray-700 hover:text-blueGray-500")
                      }
                      to="/admin/mescours"
                    >
                      <i
                        className={
                          "fas fa-table mr-2 text-sm " +
                          (window.location.href.includes("/admin/mescours")
                            ? "opacity-75"
                            : "text-blueGray-300")
                        }
                      ></i>{" "}
                      Mes Cours
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Auth Layout Pages
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              {!user && (
                <>
                  <li className="items-center">
                    <Link className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block" to="/auth/login">
                      Se connecter
                    </Link>
                  </li>
                  <li className="items-center">
                    <Link className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block" to="/auth/register">
                      Inscription
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li className="items-center">
                  <button className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block w-full text-left" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </li>
              )}
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              No Layout Pages
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  to="/landing"
                >
                  <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Landing Page
                </Link>
              </li>
              {/* Dashboards for Enseignant & Apprenant */}
              {normalizedRole === 'enseignant' && (
                <li className="items-center">
                  <Link
                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                    to="/enseignant"
                  >
                    <i className="fas fa-chalkboard-teacher text-blueGray-400 mr-2 text-sm"></i>
                    Enseignant
                  </Link>
                </li>
              )}
              {normalizedRole === 'apprenant' && (
                <li className="items-center">
                  <Link
                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                    to="/apprenant"
                  >
                    <i className="fas fa-user-graduate text-blueGray-400 mr-2 text-sm"></i>
                    Apprenant
                  </Link>
                </li>
              )}
              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  to="/profile"
                >
                  <i className="fas fa-user-circle text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Profile Page
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}