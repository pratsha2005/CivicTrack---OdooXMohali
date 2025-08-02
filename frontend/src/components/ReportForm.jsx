import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { MapPin, Camera, Send } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { registerIssueRoute } from '../utils/APIRoutes';


// Fix for marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.setView(e.latlng); // pan map
    }
  });

  useEffect(() => {
    if (position) {
      map.setView(position); // move to position on update
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

export const ReportForm = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Roads',
    location: '',
  });

  const [mapPosition, setMapPosition] = useState(user?.location || { lat: 40.7128, lng: -74.0060 });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const geocodeAddress = async () => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: formData.location,
          format: 'json',
          limit: 1
        }
      });

      if (response.data.length === 0) {
        toast.error('Could not find location. Please refine your address.');
        return;
      }

      const { lat, lon } = response.data[0];
      setMapPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
      toast.success('Location found and marked on map.');
    } catch (error) {
      toast.error('Failed to fetch coordinates for address.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mapPosition) {
      toast.error('Please select a location on the map.');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const payload = new FormData();

      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('location', formData.location);
      payload.append('coordinates', JSON.stringify([mapPosition.lng, mapPosition.lat]));
      payload.append('isAnonymous', 'false');
      imageFiles.forEach((file) => payload.append('images', file));

      await axios.post(registerIssueRoute, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Issue reported successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'Roads',
        location: '',
      });
      setImageFiles([]);
      setMapPosition(user?.location || { lat: 40.7128, lng: -74.0060 });
    } catch (err) {
      toast.error('Failed to submit issue.');
    } finally {
      setUploading(false);
    }
  };

  const categories = [
    { value: 'Roads', label: 'Roads & Transportation', icon: '🛣' },
    { value: 'Cleanliness', label: 'Waste Management', icon: '🗑' },
    { value: 'Water Supply', label: 'Water & Sewage', icon: '💧' },
    { value: 'Lighting', label: 'Street Lighting', icon: '💡' },
    { value: 'Public Safety', label: 'Public Safety', icon: '🌳' },
    { value: 'Others', label: 'Other Issues', icon: '📋' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Report an Issue</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            required
            placeholder="Issue title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border p-3 rounded"
          />

          <textarea
            rows="4"
            required
            placeholder="Detailed description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-3 rounded"
          />

          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border p-3 rounded"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Location or landmark"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border p-3 rounded"
            />
            <button
              type="button"
              onClick={geocodeAddress}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Locate
            </button>
          </div>

          <div className="h-64 border rounded overflow-hidden">
            <MapContainer center={mapPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={mapPosition} setPosition={setMapPosition} />
            </MapContainer>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4"
          />

          {imageFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {imageFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            {uploading ? 'Uploading...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
