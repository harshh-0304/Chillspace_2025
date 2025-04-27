import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import ProfilePage from './ProfilePage';
import { useAuth } from '../../hooks';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const response = await auth.login(formData);
    if (response.success) {
      toast.success(response.message);
      console.log(response.user);
      console.log(response.user.role);
      const role = localStorage.setItem(response.user.role)
      // Determine redirect path based on user role
      if (response.user.role === 'admin') {
        setRedirectPath('/admin');
      } else {
        setRedirectPath('/');
      }

      setRedirect(true);
    } else {
      toast.error(response.message);
    }
  };

  const handleGoogleLogin = async (credential) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      toast.success(response.message);

      // Determine redirect path based on user role
      if (auth.user && auth.user.role === 'admin') {
        setRedirectPath('/admin');
      } else {
        setRedirectPath('/');
      }

      setRedirect(true);
    } else {
      toast.error(response.message);
    }
  };

  if (redirect) {
    return <Navigate to={redirectPath} />;
  }

  if (auth.user) {
    return auth.user.role === 'admin' ? (
      <Navigate to="/admin" />
    ) : (
      <ProfilePage />
    );
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl" style={{ marginTop: '30px' }}>
          Login
        </h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            className="mb-2 w-full rounded-md border border-gray-300 p-2"
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            className="mb-2 w-full rounded-md border border-gray-300 p-2"
          />
          <button className="primary my-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
            Login
          </button>
        </form>

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="h-0 w-1/2 border-[1px]"></div>
          <p className="small -mt-1">or</p>
          <div className="h-0 w-1/2 border-[1px]"></div>
        </div>

        {/* Google login button */}
        <div className="flex h-[50px] justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
            text="continue_with"
            width="350"
          />
        </div>

        <div className="py-2 text-center text-gray-500">
          Don't have an account yet?{' '}
          <Link className="text-black underline" to={'/register'}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
