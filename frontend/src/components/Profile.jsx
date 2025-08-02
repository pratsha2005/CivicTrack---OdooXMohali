import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Mail,
  User as UserIcon,
  MapPin,
  XCircle,
  Trash2,
  Pencil
} from 'lucide-react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  Popup
} from 'react-leaflet';
import axios from 'axios';
import {
  getCurrentUserRoute,
  getIssuesByUserId,
  updateUserProfileRoute,
  updateLocationRoute,
  deleteIssueRoute,
} from '../utils/APIRoutes';
import 'leaflet/dist/leaflet.css';
import { IssueCard } from './IssueCard';

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  return position ? (
    <Marker position={position}>
      <Popup>Your current location</Popup>
    </Marker>
  ) : null;
};

export const Profile = () => {
  const defaultCoords = { lat: 30.7046, lng: 76.7284 };
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [mapPosition, setMapPosition] = useState(defaultCoords);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(getCurrentUserRoute, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const currentUser = userRes.data.data;
        setUser(currentUser);
        setNameInput(currentUser.name);

        const geoCoords = currentUser?.location?.coordinates;
        const coords =
          geoCoords && geoCoords.length === 2
            ? { lat: geoCoords[1], lng: geoCoords[0] }
            : defaultCoords;
        setMapPosition(coords);

        const issueRes = await axios.get(`${getIssuesByUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIssues(issueRes.data.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleLocationSave = async () => {
    setIsUpdatingLocation(true);
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: locationInput,
          format: 'json',
          limit: 1
        }
      });

      if (!geoRes.data || geoRes.data.length === 0) {
        alert('❌ Location not found. Please enter a valid address.');
        return;
      }

      const { lat, lon } = geoRes.data[0];

      await axios.post(
        updateLocationRoute,
        {
          coordinates: [parseFloat(lat), parseFloat(lon)]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMapPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
      alert('✅ Location updated successfully!');
      setShowLocationPopup(false);
    } catch (err) {
      console.error('Location update error:', err);
      alert('❌ Failed to update location.');
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this issue?');
    if (!confirm) return;

    try {
      await axios.delete(`${deleteIssueRoute}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setIssues((prev) => prev.filter((i) => i._id !== id));
      alert('✅ Issue deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting issue:', err.response?.data || err.message);
      alert('❌ Failed to delete issue.');
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }
      formData.append('name', nameInput);

      const response = await axios.patch(updateUserProfileRoute, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response?.status === 200 && response?.data?.success) {
        setUser(response.data.data);
        setSelectedImage(null);
        setShowEdit(false);
        alert('✅ Profile updated successfully!');
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <button
        onClick={() => setShowEdit(true)}
        className="absolute top-6 right-6 text-blue-600 hover:text-blue-800"
        title="Edit Profile"
      >
        <Pencil size={20} />
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <UserIcon className="text-blue-600" />
            <span>{user?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" />
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" />
            <span>
              Lat: {mapPosition.lat.toFixed(4)}, Lng: {mapPosition.lng.toFixed(4)}
            </span>
          </div>
          <button
            className="mt-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => setShowLocationPopup(true)}
          >
            Update Location
          </button>
        </div>

        <div className="w-48 h-48 relative">
          <img
            src={previewUrl || user?.profileImageUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-lg shadow"
          />
          {previewUrl && (
            <button
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 hover:text-white"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative space-y-4">
            <h3 className="text-lg font-semibold">Update Location</h3>

            <label className="block font-medium">Address</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter address"
            />

            <div className="h-60 rounded overflow-hidden z-10">
              <MapContainer
                center={[mapPosition.lat, mapPosition.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={mapPosition} setPosition={setMapPosition} />
              </MapContainer>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowLocationPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                onClick={handleLocationSave}
                disabled={isUpdatingLocation}
              >
                {isUpdatingLocation ? 'Updating...' : 'Save Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative space-y-4">
            <h3 className="text-lg font-semibold">Edit Profile</h3>

            <label className="block font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            <label className="block font-medium mt-2">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover shadow"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reported Issues */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Reported Issues</h3>
        {issues.length > 0 ? (
          <div className="space-y-6">
            {issues.map((issue) => (
              <div key={issue._id} className="relative">
                <button
                  className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-600 hover:text-white text-red-600 p-1 rounded-full shadow transition"
                  onClick={() => handleDelete(issue._id)}
                  title="Delete Issue"
                >
                  <Trash2 size={18} />
                </button>
                <IssueCard issue={issue} onClick={() => {}} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No issues reported yet.</p>
        )}
      </div>
    </div>
  );
};
