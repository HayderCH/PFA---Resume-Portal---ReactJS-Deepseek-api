import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const { setShowRecruiterLogin, backendUrl: contextBackendUrl, setCompanyToken, setCompanyData } = useContext(AppContext);

  // Override backendUrl for testing (if necessary)
  const backendUrl = contextBackendUrl || 'http://localhost:5000'; // Replace with your backend URL

  console.log('Backend URL:', backendUrl); // Debugging

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === 'Sign Up' && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === 'Login') {
        console.log('Attempting login with:', { email, password }); // Debugging
        const { data } = await axios.post(`${backendUrl}/api/candidate/login`, { email, password });

        if (data.success) {
          console.log('Login successful:', data); // Debugging
          localStorage.setItem('candidateToken', data.token);
          setShowRecruiterLogin(false);
          navigate('/dashboard');
        } else {
          console.error('Login failed:', data.message); // Debugging
          toast.error(data.message);
        }
      } else {
        // Candidate registration
        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('image', image);

        console.log('Attempting registration with:', { name, email, password, image }); // Debugging
        const { data } = await axios.post(`${backendUrl}/api/candidate/register`, formData);

        if (data.success) {
          console.log('Registration successful:', data); // Debugging
          toast.success('Account created successfully!');
          setShowRecruiterLogin(false);
          navigate('/dashboard');
        } else {
          console.error('Registration failed:', data.message); // Debugging
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Error during request:', error.message); // Debugging
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">Candidate {state}</h1>
        <p className="text-sm text-center">Welcome to our platform!</p>
        {state === 'Sign Up' && isTextDataSubmitted ? (
          <>
            <div className="flex item-center gap-4 my-10">
              <label htmlFor="image">
                <img className="w-16 rounded-full" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                <input onChange={(e) => setImage(e.target.files[0])} id="image" type="file" hidden />
              </label>
              <p>
                Upload your <br /> picture
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== 'Login' && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Candidate Name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === 'Login' && <p className="text-sm text-blue-600 my-4 mt-4 cursor-pointer">Forgot password?</p>}

        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === 'Login' ? 'login' : isTextDataSubmitted ? 'create account' : 'next'}
        </button>

        {state === 'Login' ? (
          <p className="mt-5 text-center">
            Not registered?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{' '}
            <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>
              Log in
            </span>
          </p>
        )}

        <img
          onClick={(e) => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;