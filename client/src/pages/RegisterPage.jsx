import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest', // Default role set to 'guest' to match backend expectations
  });

  const [adminMode, setAdminMode] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [errors, setErrors] = useState({});
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const auth = useAuth();
  const location = useLocation();

  // Show success message if redirected from registration
  useEffect(() => {
    if (location.state?.fromRegistration) {
      toast.success('Registration successful! Please login');
    }
  }, [location]);

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        'Password must include uppercase, lowercase, number, and special character';
    }

    // Check admin code if in admin mode
    if (adminMode && !adminCode.trim()) {
      newErrors.adminCode = 'Admin code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form data changes
  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle admin code change
  const handleAdminCodeChange = (e) => {
    setAdminCode(e.target.value);
    if (errors.adminCode) {
      setErrors({ ...errors, adminCode: '' });
    }
  };

  // Toggle admin registration mode
  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      let response;

      if (adminMode) {
        // Admin registration
        response = await auth.register({
          ...formData,
          adminCode,
          // Don't pass role for admin registration as backend will set it
        });
      } else {
        // Regular user registration
        response = await auth.register(formData);
      }

      if (response.success) {
        toast.success(response.message);

        // Determine where to redirect based on registration type and response
        if (adminMode) {
          setRedirectToAdmin(true); // Go to admin dashboard
        } else {
          setRedirectToHome(true); // Go to home page
        }
      } else {
        toast.error(response.message);
        if (response.errors) {
          setErrors(response.errors);
        }
      }
    } catch (error) {
      toast.error('Registration failed');
      console.error(error);
    }
  };

  // Handle Google login response
  const handleGoogleLogin = async (credential) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      toast.success(response.message);
      setRedirectToHome(true); // Redirect to home page after Google login
    } else {
      toast.error(response.message);
    }
  };

  // Handle redirections
  if (redirectToLogin) {
    return <Navigate to="/login" state={{ fromRegistration: true }} />;
  }

  if (redirectToAdmin) {
    return <Navigate to="/admin" />;
  }

  if (redirectToHome) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-center p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl" style={{ marginTop: '60px' }}>
          {adminMode ? 'Admin Registration' : 'Register'}
        </h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
          {/* Name Field */}
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleFormData}
            className={`mb-2 w-full rounded-md border p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="mb-2 text-sm text-red-500">{errors.name}</p>
          )}

          {/* Email Field */}
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            className={`mb-2 w-full rounded-md border p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="mb-2 text-sm text-red-500">{errors.email}</p>
          )}

          {/* Password Field */}
          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            className={`mb-2 w-full rounded-md border p-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && (
            <p className="mb-2 text-sm text-red-500">{errors.password}</p>
          )}

          {!adminMode && (
            /* Role Selection Dropdown - Only for normal users */
            <select
              name="role"
              value={formData.role}
              onChange={handleFormData}
              className="mb-2 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="guest">Guest</option>
              <option value="host">Host</option>
            </select>
          )}

          {adminMode && (
            /* Admin Code Field - Only for admin registration */
            <>
              <input
                name="adminCode"
                type="password"
                placeholder="Admin Registration Code"
                value={adminCode}
                onChange={handleAdminCodeChange}
                className={`mb-2 w-full rounded-md border p-2 ${errors.adminCode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.adminCode && (
                <p className="mb-2 text-sm text-red-500">{errors.adminCode}</p>
              )}
            </>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="my-2 w-full rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            {adminMode ? 'Register as Admin' : 'Register'}
          </button>
        </form>

        {/* Admin Mode Toggle */}
        <div className="my-2 text-center">
          <button
            type="button"
            onClick={toggleAdminMode}
            className="text-blue-500 hover:underline"
          >
            {adminMode ? 'Switch to Regular Registration' : 'Register as Admin'}
          </button>
        </div>

        {!adminMode && (
          <>
            {/* Divider or OR - Only for normal registration */}
            <div className="mb-4 flex w-full items-center gap-4">
              <div className="h-0 w-1/2 border-[1px]"></div>
              <p className="small -mt-1">or</p>
              <div className="h-0 w-1/2 border-[1px]"></div>
            </div>

            {/* Google Login Button - Only for normal registration */}
            <div className="flex justify-center">
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
          </>
        )}

        {/* Login Redirection Link */}
        <div className="py-2 text-center text-gray-500">
          Already a member?
          <Link className="ml-1 text-black underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
