import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, Mail, Text, Home, Key } from 'lucide-react';


import { useAuth } from '../../hooks';
import AccountNav from '@/components/ui/AccountNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EditProfileDialog from '@/components/ui/EditProfileDialog';
import PlacesPage from './PlacesPage';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [redirect, setRedirect] = useState(null);
  const { subpage = 'profile' } = useParams();

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success(response.message);
      setRedirect('/');
    } else {
      toast.error(response.message);
    }
  };

  if (!user && !redirect) return <Navigate to="/login" />;
  if (redirect) return <Navigate to={redirect} />;

  const RoleBadge = () => {
    const role = user?.role || 'user';
    const badgeStyles = {
      host: { class: 'bg-green-100 text-green-800', icon: <Home className="mr-1 h-4 w-4" /> },
      admin: { class: 'bg-purple-100 text-purple-800', icon: <Key className="mr-1 h-4 w-4" /> },
      default: { class: 'bg-blue-100 text-blue-800', icon: null }
    };

    const { class: badgeClass, icon } = badgeStyles[role] || badgeStyles.default;

    return (
      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
        {icon}
        {role.toUpperCase()}
      </div>
    );
  };

  return (
    <div>
      <AccountNav />

      {subpage === 'profile' && (
        <div className="m-4 flex flex-col items-center gap-8 rounded-xl p-4 sm:flex-row lg:gap-28 lg:px-20">
          
          {/* Avatar */}
          <div className="flex h-20 w-20 sm:h-36 sm:w-36 md:h-48 md:w-48 justify-center rounded-full bg-gray-200 p-2">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={user.picture || 'https://res.cloudinary.com/rahul4019/image/upload/v1695133265/pngwing.com_zi4cre.png'}
                className="object-cover"
              />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Content */}
          <div className="flex grow flex-col items-center gap-8 sm:items-start sm:justify-around">
            
            {/* User Info */}
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 text-xl">
                <Text className="h-5 w-5" />
                <span>Name:</span>
                <span className="text-gray-600">{user.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5" />
                <span>Email:</span>
                <span className="text-gray-600">{user.email}</span>
              </div>

              {/* Role */}
              <div className="mt-2">
                <RoleBadge />
              </div>

              {/* Host Message */}
              {user?.role === 'host' && (
                <p className="text-sm text-green-600">You can manage your listings in the Places section.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex w-full justify-around sm:justify-end sm:gap-5">
              <EditProfileDialog />
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {subpage === 'places' && <PlacesPage />}
    </div>
  );
};

export default ProfilePage;
