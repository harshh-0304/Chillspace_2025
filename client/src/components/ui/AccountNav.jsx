
import { Link, useLocation } from 'react-router-dom';

const AccountNav = () => {
  const { pathname } = useLocation();
  let subpage = pathname.split('/')?.[2];

  if (!subpage) subpage = 'profile';

  const linkClasses = (type = null) => {
    let base =
      'flex items-center gap-1 py-2 px-6 rounded-full transition-colors duration-200';
    let active =
      'bg-primary text-white dark:bg-blue-600 dark:text-white';
    let inactive =
      'bg-gray-200 text-black dark:bg-gray-800 dark:text-gray-200';

    return `${base} ${type === subpage ? active : inactive}`;
  };

  // Retrieve user role from localStorage
  const userRole = localStorage.getItem('userRole');

  return (
    <nav className="mt-24 mb-8 flex w-full flex-col items-center justify-center gap-3 p-8 md:flex-row md:p-0">
      {/* Home Button */}
      <Link
        className="flex items-center gap-1 py-2 px-6 rounded-full bg-gray-100 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        to="/"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75v10.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20.25V9.75z"
          />
        </svg>
        Home
      </Link>

      {/* Profile */}
      <Link className={linkClasses('profile')} to="/account">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z"
          />
        </svg>
        My Profile
      </Link>

      {/* Bookings */}
      <Link className={linkClasses('bookings')} to="/account/bookings">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        My Bookings
      </Link>

      {/* Conditionally render "My Accommodations" based on role */}
      {userRole !== 'guest' && (
        <Link className={linkClasses('places')} to="/account/places">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
            />
          </svg>
          My Accommodations
        </Link>
      )}

      {/* Conditionally render "Admin Dashboard" based on role */}
      {userRole === 'admin' && (
        <Link className={linkClasses('admin')} to="/admin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v18M3 12h18"
            />
          </svg>
          Admin Dashboard
        </Link>
      )}

     
     
    </nav>
  );
};

export default AccountNav;
