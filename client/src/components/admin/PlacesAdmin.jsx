import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PlacesAdmin() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/places/')
      .then(res => {
        // Log the response to understand its structure
        console.log(res.data); 

        // Ensure places is an array in case the response structure is different
        setPlaces(Array.isArray(res.data) ? res.data : res.data.places || []);
      })
      .catch(err => {
        console.error('Error fetching places:', err);
        setPlaces([]); // Set empty array in case of error
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:4000/places/${id}`);
      setPlaces(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Places</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.length > 0 ? (
            places.map(place => (
              <tr key={place._id}>
                <td className="border p-2">{place.title}</td>
                <td className="border p-2">{place.address}</td>
                <td className="border p-2">
                  <button onClick={() => handleDelete(place._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center border p-2">No places available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
