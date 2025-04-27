// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function UsersAdmin() {
//   const [users, setUsers] = useState([]);

// //   useEffect(() => {
// //     // Use the correct backend URL
// //     axios.get('http://localhost:4000/user/') // Ensure this URL points to your backend
// //       .then(res => {
// //         // Check if the data is an array before setting the state
// //         if (Array.isArray(res.data)) {
// //           setUsers(res.data);
// //         } else {
// //           // If not an array, log an error or set users to an empty array
// //           console.error("Expected an array of users but got:", res.data);
// //           setUsers([]);
// //         }
// //       })
// //       .catch(() => {
// //         // Fake user list if the API call fails
// //         setUsers([
// //           { _id: '1', name: 'Kiyo', email: 'admin@chillspace.com' },
// //           { _id: '2', name: 'Demo User', email: 'user@chillspace.com' },
// //         ]);
// //       });
// //   }, []);
// useEffect(() => {
//     // Use the correct backend URL
//     axios.get('http://localhost:4000/user')  // Make sure this URL points to your backend
//       .then(res => {
//         // Check if the 'users' field in the response is an array before setting the state
//         if (Array.isArray(res.data.users)) {
//           setUsers(res.data.users); // Set users from the response object
//         } else {
//           console.error("Expected an array of users but got:", res.data.users);
//           setUsers([]); // Set users to an empty array if the data format is unexpected
//         }
//       })
//       .catch(() => {
//         // Fake user list if the API call fails
//         setUsers([
//           { _id: '1', name: 'Kiyo', email: 'admin@chillspace.com' },
//           { _id: '2', name: 'Demo User', email: 'user@chillspace.com' },
//         ]);
//       });
//   }, []);
  

//   return (
//     <div>
//       <h1 className="text-xl font-semibold mb-4">Manage Users</h1>
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.isArray(users) && users.length > 0 ? (
//             users.map(user => (
//               <tr key={user._id}>
//                 <td className="border p-2">{user.name}</td>
//                 <td className="border p-2">{user.email}</td>
//                 <td className="border p-2">
//                   <button onClick={() => handleFakeDelete(user._id)} className="text-red-600"> Delete</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="3" className="text-center p-2">No users found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Use the correct backend URL
    axios.get('http://localhost:4000/user')  // Make sure this URL points to your backend
      .then(res => {
        // Check if the 'users' field in the response is an array before setting the state
        if (Array.isArray(res.data.users)) {
          setUsers(res.data.users); // Set users from the response object
        } else {
          console.error("Expected an array of users but got:", res.data.users);
          setUsers([]); // Set users to an empty array if the data format is unexpected
        }
      })
      .catch(() => {
        // Fake user list if the API call fails
        setUsers([
          { _id: '1', name: 'Kiyo', email: 'admin@chillspace.com' },
          { _id: '2', name: 'Demo User', email: 'user@chillspace.com' },
        ]);
      });
  }, []);

  // Handle deleting a user
  const handleDelete = (userId) => {
    axios.delete(`http://localhost:4000/user/delete/${userId}`)
      .then(res => {
        // Filter out the deleted user from the state
        setUsers(users.filter(user => user._id !== userId));
        console.log('User deleted:', res.data);
      })
      .catch(err => {
        console.error('Error deleting user:', err);
      });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Manage Users</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map(user => (
              <tr key={user._id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
