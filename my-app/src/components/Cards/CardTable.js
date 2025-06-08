import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "components/Cards/CardTablee.css";
import { AuthContext } from "views/auth/AuthContext";

// Pagination constants
const ITEMS_PER_PAGE = 10;

export default function CardTable({ color }) {
  const {
    user,
    loading: authLoading,
    refreshAccessToken,
  } = useContext(AuthContext);
  
  // States
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToUnblock, setUserToUnblock] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

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
        
        // console.log("Raw API response:", response.data);
        
        // For debugging, removed to fix warning
        // const sampleUser = response.data && response.data.length > 0 ? response.data[0] : null;
        // if (sampleUser) {
        //   console.log("User properties:", Object.keys(sampleUser));
        //   console.log("Sample user:", {
        //     id: sampleUser.id,
        //     email: sampleUser.email,
        //     createdAt: sampleUser.createdAt,
        //     created_at: sampleUser.created_at,
        //     CREATEDAT: sampleUser.CREATEDAT,
        //     CREATED_AT: sampleUser.CREATED_AT
        //   });
        // }
        
        const processedUsers = response.data.map(user => ({
          ...user,
          // Add a guaranteed creation date field
          displayDate: user.createdAt || user.created_at || new Date().toISOString()
        }));
        
        setUsers(processedUsers);
      } catch (err) {
        if (err.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
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
  }, [isAdmin, user, authLoading, refreshAccessToken]);

  // Handle block user
  const handleBlockClick = (id) => {
    setUserToBlock(id);
    setShowBlockModal(true);
  };

  const handleConfirmBlock = async () => {
    setActionLoading(true);
    if (userToBlock && reason.trim()) {
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
          const newToken = await refreshAccessToken();
          if (newToken) handleConfirmBlock();
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
          const newToken = await refreshAccessToken();
          if (newToken) handleConfirmUnblock();
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

  // Handle delete user
  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    setActionLoading(true);
    if (userToDelete) {
      try {
        await axios.delete(
          `http://localhost:8087/users/delete/${userToDelete}`,
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        setUsers(users.filter((u) => u.id !== userToDelete));
        setError(null);
      } catch (err) {
        if (err.response?.status === 401) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            handleConfirmDelete();
            return;
          }
          setError("Session expirée, veuillez vous reconnecter");
        } else {
          setError(
            err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur"
          );
        }
      } finally {
        setActionLoading(false);
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowBlockModal(false);
    setShowUnblockModal(false);
    setShowDeleteModal(false);
    setUserToBlock(null);
    setUserToUnblock(null);
    setUserToDelete(null);
    setReason("");
    setError(null);
    setShowBulkDeleteModal(false);
  };

  // Bulk selection handlers
  const handleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    const allIds = filteredUsers.map((u) => u.id);
    setSelectedUserIds((prev) =>
      prev.length === allIds.length ? [] : allIds
    );
  };
  const handleBulkDelete = () => setShowBulkDeleteModal(true);
  const handleConfirmBulkDelete = async () => {
    setActionLoading(true);
    try {
      await Promise.all(
        selectedUserIds.map((id) =>
          axios.delete(
            `http://localhost:8087/users/delete/${id}`,
            { headers: { Authorization: `Bearer ${user.accessToken}` } }
          )
        )
      );
      setUsers(users.filter((u) => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          handleConfirmBulkDelete(); return;
        }
        setError("Session expirée, veuillez vous reconnecter");
      } else {
        setError(
          err.response?.data?.message || "Erreur lors de la suppression des utilisateurs"
        );
      }
    } finally {
      setActionLoading(false);
      setShowBulkDeleteModal(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Filter and paginate users
  // Basic text filtering
  let filteredUsers = users.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.nom?.toLowerCase().includes(searchLower) ||
      u.prenom?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower)
    );
  });
  // Apply sorting by creation date
  filteredUsers.sort((a, b) => {
    // Use the displayDate field which is guaranteed to exist
    const dateA = a.displayDate ? new Date(a.displayDate).getTime() : a.id;
    const dateB = b.displayDate ? new Date(b.displayDate).getTime() : b.id;
    
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    <div className={`tableau-admin relative flex flex-col min-w-0 mb-6 rounded ${
        color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
      }`}
    >
      {/* Bulk delete button */}
      <div className="px-4 py-2">
        <button
          className="bouton-supprimer"
          onClick={handleBulkDelete}
          disabled={actionLoading || selectedUserIds.length === 0}
        >
          Supprimer sélectionnés ({selectedUserIds.length})
        </button>
      </div>
      {/* Add error display */}
      {error && (
        <div className="px-4 py-3 bg-red-100 text-red-700 rounded-t">
          {error}
        </div>
      )}

      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center justify-between">
           {/* Sorting toggle icon button */}
           <div className="px-4 py-1 flex-shrink-0">
             <button
               onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
               className="bouton-tri ml-2"
               title={sortOrder === "newest" ? "Trier du plus récent au plus ancien" : "Trier du plus ancien au plus récent"}
             >
               {sortOrder === "newest" ? "▼" : "▲"}
             </button>
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
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="tableau-utilisateurs items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredUsers.length > 0 &&
                    selectedUserIds.length === filteredUsers.length
                  }
                />
              </th>
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
                Date de création
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
            {paginatedUsers.map((u, index) => (
              <tr key={u.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={() => handleSelectUser(u.id)}
                    checked={selectedUserIds.includes(u.id)}
                  />
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {u.displayDate ? new Date(u.displayDate).toLocaleDateString('fr-FR') : (new Date()).toLocaleDateString('fr-FR')}
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
                    className="bouton-bloquer"
                    onClick={() => handleBlockClick(u.id)}
                    disabled={actionLoading || u.blocked}
                  >
                    Bloquer
                  </button>
                  <button
                    className="bouton-supprimer"
                    onClick={() => handleDeleteClick(u.id)}
                    disabled={actionLoading}
                  >
                    Supprimer
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

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de{" "}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              à{" "}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
              </span>{" "}
              sur <span className="font-medium">{filteredUsers.length}</span> résultats
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } text-sm font-medium`}
              >
                Précédent
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                } text-sm font-medium`}
              >
                Suivant
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {/* Modal for Delete Action */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmation de suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?</p>
            <div className="modal-actions">
              <button
                className="bouton-confirmer"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Suppression en cours..." : "Oui, supprimer"}
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

      {/* Modal for Bulk Delete */}
      {showBulkDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmation de suppression multiple</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer ces{" "}
              {selectedUserIds.length} utilisateurs ?
            </p>
            <div className="modal-actions">
              <button
                className="bouton-confirmer"
                onClick={handleConfirmBulkDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Suppression en cours..." : "Oui, supprimer"}
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
