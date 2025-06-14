import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
  // State for user data and form inputs
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirm_password: '',
    role: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get user ID from URL and navigate hook
  const { id } = useParams();
  const navigate = useNavigate();

  // Base URL for your backend API
  const API_URL = 'http://localhost:8080/users'; // Corrected to default Spring Boot port

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('Fetching user profile with ID:', id); // Debug log
      // Validate ID
      if (!id || isNaN(id)) {
        console.error('Invalid or missing user ID');
        setError('Invalid or missing user ID in the URL.');
        setLoading(false);
        return;
      }

      // Check for token
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug log
      if (!token) {
        console.error('No token found, redirecting to login');
        setError('Please log in to view this profile.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User data received:', response.data); // Debug log

        setUser({
          nom: response.data.nom || '',
          prenom: response.data.prenom || '',
          email: response.data.email || '',
          password: '',
          confirm_password: '',
          role: response.data.role || 'N/A',
          status: response.data.status || 'N/A',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err); // Debug log
        if (err.response) {
          if (err.response.status === 401) {
            setError('Unauthorized: Please log in again.');
            navigate('/login');
          } else if (err.response.status === 404) {
            setError('User not found.');
          } else {
            setError('Failed to load user profile. Please try again.');
          }
        } else {
          setError('Network error. Please check your connection.');
        }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', user); // Debug log

    // Basic validation
    if (!user.nom || !user.prenom || !user.email) {
      setError('All fields (except password) are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(user.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (user.password && user.password !== user.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    if (user.password && user.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to update the profile.');
      navigate('/login');
      return;
    }

    // Prepare data for update
    const updateData = {
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role, // Included, but backend may restrict updates
    };
    if (user.password) {
      updateData.password = user.password;
    }
    console.log('Sending update data:', updateData); // Debug log

    try {
      const response = await axios.put(`${API_URL}/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Update response:', response.data); // Debug log
      setSuccess('Profile updated successfully!');
      setError(null);
      setUser({
        ...user,
        nom: response.data.nom,
        prenom: response.data.prenom,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status,
        password: '',
        confirm_password: '',
      });
    } catch (err) {
      console.error('Error updating profile:', err); // Debug log
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized: Please log in again.');
          navigate('/login');
        } else if (err.response.status === 404) {
          setError('User not found.');
        } else {
          setError('Failed to update profile. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
      setSuccess(null);
    }
  };

  // Handle loading state
  if (loading) {
    console.log('Rendering loading state'); // Debug log
    return <div className="text-center text-blueGray-600">Loading...</div>;
  }

  // Handle error state
  if (error) {
    console.log('Rendering error state:', error); // Debug log
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Render form
  console.log('Rendering form with user data:', user); // Debug log
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">My Account</h6>
          <button
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            User Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="prenom"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="prenom"
                  id="prenom"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={user.prenom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="nom"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={user.nom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={user.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={user.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="confirm_password"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={user.confirm_password}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  Role
                </label>
                <p className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full">
                  {user.role}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  Status
                </label>
                <p className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow w-full">
                  {user.status}
                </p>
              </div>
            </div>
          </div>
          {success && (
            <div className="text-green-500 text-center mt-4">{success}</div>
          )}
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Profile;