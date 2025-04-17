import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardAdmin() {
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Update the URL to point to your local backend API
    axios.get('http://localhost:4000/places') // Backend for places
      .then(res => setPlaces(res.data))
      .catch(() => {
        // Handle error if backend call fails
        console.error("Failed to fetch places");
      });

    axios.get('http://localhost:4000/user') // Backend for users
      .then(res => setUsers(res.data))
      .catch(() => {
        // Fake user list if API is unavailable
        setUsers([
          { _id: '1', name: 'Kiyo', email: 'admin@chillspace.com' },
          { _id: '2', name: 'Demo User', email: 'user@chillspace.com' },
        ]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-2">
        <p>🔹 Total Listings: {places.length}</p>
        <p>👤 Total Users: {users.length}</p>
      </div>
    </div>
  );
}
