// // import { Outlet, Link, useNavigate } from 'react-router-dom';
// // import { useEffect } from 'react';
// // import { isAdmin } from '../../utils/isAdmin';

// // export default function AdminLayout() {
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!isAdmin()) {
// //       alert("Access denied. Admins only.");
// //       navigate('/');
// //     }
// //   }, []);

// //   return (
// //     <div className="flex h-screen">
// //       <aside className="w-64 bg-gray-900 text-white p-4">
// //         <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
// //         <nav>
// //           <ul className="space-y-2">
// //             <li><Link to="/admin">Dashboard</Link></li>
// //             <li><Link to="/admin/users">Users</Link></li>
// //             <li><Link to="/admin/places">Places</Link></li>
// //           </ul>
// //         </nav>
// //       </aside>
// //       <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }
// import { Outlet, Link } from 'react-router-dom';

// export default function AdminLayout() {
//   return (
//     <div className="flex h-screen">
//       <aside className="w-64 bg-gray-900 text-white p-4">
//         <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
//         <nav>
//           <ul className="space-y-2">
//             <li><Link to="/admin">Dashboard</Link></li>
//             <li><Link to="/admin/users">Users</Link></li>
//             <li><Link to="/admin/places">Places</Link></li>
//           </ul>
//         </nav>
//       </aside>
//       <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 sticky top-0 h-full">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin"
                className="text-lg font-semibold hover:text-indigo-400 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="text-lg font-semibold hover:text-indigo-400 transition-colors"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/places"
                className="text-lg font-semibold hover:text-indigo-400 transition-colors"
              >
                Places
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
