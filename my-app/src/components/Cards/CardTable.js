import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "components/Cards/CardTablee.css";

// components
import { AuthContext } from "views/auth/AuthContext";

export default function CardTable({ color }) {
  const {
    user,
    loading: authLoading,
    refreshTokenIfNeeded,
  } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false); // Added for unblock confirmation
  const [userToBlock, setUserToBlock] = useState(null);
  const [userToReject, setUserToReject] = useState(null);
  const [userToUnblock, setUserToUnblock] = useState(null); // Added for unblock user
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null); // Added error state

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin || authLoading) return;
      try {
        setError(null);
        const response = await axios.get("http://localhost:8087/users/all", {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        setUsers(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) {
            fetchUsers();
          } else {
            setError("Session expirée, veuillez vous reconnecter");
          }
        } else {
          setError(
            err.response?.data?.message ||
              "Erreur lors de la récupération des utilisateurs"
          );
        }
      }
    };
    fetchUsers();
  }, [isAdmin, user, authLoading, refreshTokenIfNeeded]);

  // Handle activate user
  const handleActivateClick = async (id) => {
    setActionLoading(true);
    try {
      await axios.put(
        `http://localhost:8087/users/activate/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      setUsers(users.map((u) => (u.id === id ? { ...u, active: true } : u)));
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshTokenIfNeeded();
        if (refreshed) handleActivateClick(id);
      } else {
        setError(
          err.response?.data?.message ||
            "Erreur lors de l'activation de l'utilisateur"
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle block user
  const handleBlockClick = (id) => {
    setUserToBlock(id);
    setShowBlockModal(true);
  };
  const handleConfirmBlock = async () => {
    setActionLoading(true);
    if (userToBlock) {
      try {
        await axios.put(
          `http://localhost:8087/users/block/${userToBlock}`,
          { reason },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        setUsers(
          users.map((u) => (u.id === userToBlock ? { ...u, blocked: true } : u))
        );
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) handleConfirmBlock();
        } else {
          setError(
            err.response?.data?.message ||
              "Erreur lors du blocage de l'utilisateur"
          );
        }
      } finally {
        setActionLoading(false);
        setShowBlockModal(false);
        setUserToBlock(null);
        setReason("");
      }
    }
  };

  // Handle reject user
  const handleRejectClick = (id) => {
    setUserToReject(id);
    setShowRejectModal(true);
  };
  const handleConfirmReject = async () => {
    setActionLoading(true);
    if (userToReject) {
      try {
        await axios.put(
          `http://localhost:8087/users/rejetee/${userToReject}`,
          { reason },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        setUsers(
          users.map((u) =>
            u.id === userToReject ? { ...u, rejected: true } : u
          )
        );
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) handleConfirmReject();
        } else {
          setError(
            err.response?.data?.message ||
              "Erreur lors du rejet de l'utilisateur"
          );
        }
      } finally {
        setActionLoading(false);
        setShowRejectModal(false);
        setUserToReject(null);
        setReason("");
      }
    }
  };

  // Handle unblock user
  const handleUnblockClick = (id) => {
    setUserToUnblock(id);
    setShowUnblockModal(true);
  };
  const handleConfirmUnblock = async () => {
    setActionLoading(true);
    if (userToUnblock) {
      try {
        await axios.put(
          `http://localhost:8087/users/unblock/${userToUnblock}`,
          {},
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        setUsers(
          users.map((u) =>
            u.id === userToUnblock ? { ...u, blocked: false } : u
          )
        );
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) handleConfirmUnblock();
        } else {
          setError(
            err.response?.data?.message ||
              "Erreur lors du déblocage de l'utilisateur"
          );
        }
      } finally {
        setActionLoading(false);
        setShowUnblockModal(false);
        setUserToUnblock(null);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowBlockModal(false);
    setShowRejectModal(false);
    setShowUnblockModal(false);
    setUserToBlock(null);
    setUserToReject(null);
    setUserToUnblock(null);
    setReason("");
    setError(null);
  };

  const filteredUsers = users.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.nom?.toLowerCase().includes(searchLower) ||
      u.prenom?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower)
    );
  });

  if (authLoading) {
    return <div className="chargement">Chargement...</div>;
  }

  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  if (!isAdmin) {
    return <div>Accès refusé : Vous devez être administrateur</div>;
  }

  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      {/* Add error display */}
      {error && (
        <div className="px-4 py-3 bg-red-100 text-red-700 rounded-t">
          {error}
        </div>
      )}

      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
              className={
                "font-semibold text-lg " +
                (color === "light" ? "text-blueGray-700" : "text-white")
              }
            >
              Liste des utilisateurs
            </h3>
          </div>
          {/* Add search input */}
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full"
            />
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                ID
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Nom
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Prénom
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Email
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Rôle
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Clé
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Statut
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                }
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.id}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.nom}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.prenom}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.email}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.role}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.cle || "-"}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.blocked
                    ? "Bloqué"
                    : u.rejected
                    ? "Rejeté"
                    : u.active
                    ? "Actif"
                    : "Inactif"}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                  <button
                    className="bouton-activer"
                    onClick={() => handleActivateClick(u.id)}
                    disabled={actionLoading || u.active}
                  >
                    Activer
                  </button>
                  <button
                    className="bouton-bloquer"
                    onClick={() => handleBlockClick(u.id)}
                    disabled={actionLoading || u.blocked}
                  >
                    Bloquer
                  </button>
                  <button
                    className="bouton-rejeter"
                    onClick={() => handleRejectClick(u.id)}
                    disabled={actionLoading || u.rejected}
                  >
                    Rejeter
                  </button>
                  <button
                    className="bouton-debloquer"
                    onClick={() => handleUnblockClick(u.id)}
                    disabled={actionLoading || !u.blocked}
                  >
                    Débloquer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Block Action */}
      {showBlockModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmation de blocage</h3>
            <p>Êtes-vous sûr de vouloir bloquer cet utilisateur ?</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison du blocage"
              required
            />
            <div className="modal-actions">
              <button
                className="bouton-confirmer"
                onClick={handleConfirmBlock}
                disabled={actionLoading || !reason.trim()}
              >
                {actionLoading ? "Blocage en cours..." : "Oui, bloquer"}
              </button>
              <button className="bouton-annuler" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Reject Action */}
      {showRejectModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmation du rejet</h3>
            <p>Êtes-vous sûr de vouloir rejeter cet utilisateur ?</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Raison du rejet"
              required
            />
            <div className="modal-actions">
              <button
                className="bouton-confirmer"
                onClick={handleConfirmReject}
                disabled={actionLoading || !reason.trim()}
              >
                {actionLoading ? "Rejet en cours..." : "Oui, rejeter"}
              </button>
              <button className="bouton-annuler" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Unblock Action */}
      {showUnblockModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmation du déblocage</h3>
            <p>Êtes-vous sûr de vouloir débloquer cet utilisateur ?</p>
            <div className="modal-actions">
              <button
                className="bouton-confirmer"
                onClick={handleConfirmUnblock}
                disabled={actionLoading}
              >
                {actionLoading ? "Déblocage en cours..." : "Oui, débloquer"}
              </button>
              <button className="bouton-annuler" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
