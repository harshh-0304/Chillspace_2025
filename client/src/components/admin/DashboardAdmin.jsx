import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardAdmin() {
  const [placesCount, setPlacesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    // Fetch places
    axios.get('http://localhost:4000/places/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.places || [];
        setPlacesCount(data.length);
      })
      .catch((err) => {
        console.error("Failed to fetch places:", err);
        setPlacesCount(0);
      });

    // Fetch users
    axios.get('http://localhost:4000/user')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.users || [];
        setUsersCount(data.length);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsersCount(2);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">📊 Admin Dashboard</h1>
        <div className="space-y-4 text-lg">
          <div className="flex justify-between bg-blue-100 text-blue-900 p-4 rounded-lg">
            <span>Total Listings:</span>
            <span className="font-bold">{placesCount}</span>
          </div>
          <div className="flex justify-between bg-green-100 text-green-900 p-4 rounded-lg">
            <span>Total Users:</span>
            <span className="font-bold">{usersCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
