'use client';  
import BASE_URL from '@/app/lib/config';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  
import axios from 'axios';

const LoginPage = () => {
  console.log("BASE_URL is:", BASE_URL);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post(`${BASE_URL}/loginAdmin.php`, {
        username: username,
        password: password
      });

      console.log('Login response:', response.data);

      if (response.data.status === 'success') {
        
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);
        
        
        router.push('/homeAdmin');
      } else {
        setErrorMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        :root {
          --blue-light: #60a5fa;
          --blue-lighter: #bfdbfe;
          --gray-dark: #374151;
          --gray-medium: #6b7280;
          --input-bg: #f9fafb;
          --border-radius: 0.75rem;
          --shadow-light: 0 4px 6px rgba(96, 165, 250, 0.1);
          --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
        }

        body, html, #root {
          height: 100%;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #ffffff;
          color: var(--gray-dark);
        }

        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        .login-card {
          background: white;
          padding: 2.5rem 3rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: transform var(--transition);
        }

        .login-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(96, 165, 250, 0.15);
        }

        h1 {
          font-weight: 600;
          font-size: 2rem;
          margin: 0 0 1.5rem 0;
          color: var(--blue-light);
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          text-align: left;
        }

        label {
          font-weight: 600;
          color: var(--gray-medium);
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: var(--border-radius);
          border: 1.5px solid var(--blue-lighter);
          background-color: var(--input-bg);
          color: var(--gray-dark);
          transition: all var(--transition);
          outline-offset: 2px;
        }

        input[type="text"]:focus,
        input[type="password"]:focus {
          border-color: var(--blue-light);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          background-color: white;
          transform: translateY(-2px);
        }

        button {
          margin-top: 1rem;
          padding: 0.75rem 0;
          background: var(--blue-light);
          border: none;
          border-radius: var(--border-radius);
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          width: 100%;
        }

        button:hover,
        button:focus {
          background-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          outline: none;
        }

        .sign-up {
          margin-top: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--blue-light);
          text-decoration: underline;
          cursor: pointer;
          transition: color var(--transition);
        }

        .sign-up:hover,
        .sign-up:focus {
          color: #3b82f6;
        }

        .logo-image {
          height: 100px;
          width: 100px;
          margin: auto auto 1rem auto;
          border-radius: 50%;
          background: var(--blue-lighter);
          border: 2px solid var(--blue-light);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
          color: var(--blue-light);
          user-select: none;
        }

        .error-message {
          color: #ef4444;
          background-color: #fee2e2;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          margin-top: 1rem;
          font-size: 0.9rem;
          transition: all var(--transition);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="container" role="main">
        <section className="login-card" aria-label="Login form">
          <img src="/oxypulselogo.png"
            className="logo-image"
            alt="oxypulselogo"
          />
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="admin_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="text"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <button type="submit" aria-label="Log in to admin account">
              Sign In
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default LoginPage;
