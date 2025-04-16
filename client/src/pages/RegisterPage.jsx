// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { GoogleLogin } from '@react-oauth/google';
// import { Navigate } from 'react-router-dom';

// import { useAuth } from '../../hooks';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });
//   const [redirect, setRedirect] = useState(false);
//   const auth = useAuth();

//   const handleFormData = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const response = await auth.register(formData);
//     if (response.success) {
//       toast.success(response.message);
//       setRedirect(true);
//     } else {
//       toast.error(response.message);
//     }
//   };

//   const handleGoogleLogin = async (credential) => {
//     const response = await auth.googleLogin(credential);
//     if (response.success) {
//       toast.success(response.message);
//       setRedirect(true);
//     } else {
//       toast.error(response.message);
//     }
//   };

//   if (redirect) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
//       <div className="mb-40">
//         <h1 className="mb-4 text-center text-4xl" style={{marginTop:"60px"}}>Register</h1>
//         <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
//           <input
//             name="name"
//             type="text"
//             placeholder="John Doe"
//             value={formData.name}
//             onChange={handleFormData}
//           />
//           <input
//             name="email"
//             type="email"
//             placeholder="your@email.com"
//             value={formData.email}
//             onChange={handleFormData}
//           />
//           <input
//             name="password"
//             type="password"
//             placeholder="password"
//             value={formData.password}
//             onChange={handleFormData}
//           />
//           <button className="primary my-2">Register</button>
//         </form>

//         <div className="mb-4 flex w-full items-center gap-4">
//           <div className="h-0 w-1/2 border-[1px]"></div>
//           <p className="small -mt-1">or</p>
//           <div className="h-0 w-1/2 border-[1px]"></div>
//         </div>

//         {/* Google login button */}
//         <div className="flex h-[50px] justify-center">
//           <GoogleLogin
//             onSuccess={(credentialResponse) => {
//               handleGoogleLogin(credentialResponse.credential);
//             }}
//             onError={() => {
//               console.log('Login Failed');
//             }}
//             text="continue_with"
//             width="350"
//           />
//         </div>

//         <div className="py-2 text-center text-gray-500">
//           Already a member?
//           <Link className="text-black underline" to={'/login'}>
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
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
  });
  const [errors, setErrors] = useState({});
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const auth = useAuth();
  const location = useLocation();

  // Show success message if redirected from registration
  useEffect(() => {
    if (location.state?.fromRegistration) {
      toast.success('Registration successful! Please login');
    }
  }, [location]);

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase, number, and special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const response = await auth.register(formData);
    if (response.success) {
      toast.success(response.message);
      setRedirectToLogin(true);
    } else {
      toast.error(response.message);
      if (response.errors) {
        setErrors(response.errors);
      }
    }
  };

  const handleGoogleLogin = async (credential) => {
    const response = await auth.googleLogin(credential);
    if (response.success) {
      toast.success(response.message);
      setRedirectToLogin(true);
    } else {
      toast.error(response.message);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" state={{ fromRegistration: true }} />;
  }

  return (
    <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
      <div className="mb-40">
        <h1 className="mb-4 text-center text-4xl" style={{marginTop:"60px"}}>Register</h1>
        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleFormData}
            className={`w-full p-2 mb-1 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleFormData}
            className={`w-full p-2 mb-1 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={handleFormData}
            className={`w-full p-2 mb-1 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

          <button 
            type="submit" 
            className="primary my-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
          >
            Register
          </button>
        </form>

        <div className="mb-4 flex w-full items-center gap-4">
          <div className="h-0 w-1/2 border-[1px]"></div>
          <p className="small -mt-1">or</p>
          <div className="h-0 w-1/2 border-[1px]"></div>
        </div>

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
          Already a member?
          <Link className="text-black underline ml-1" to={'/login'}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;