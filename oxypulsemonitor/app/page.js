'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${BASE_URL}/login.php`, {
        email,
        password
      });

      if (response.data.status === 'success') {
        
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userType', response.data.userType); 
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.userName);

        
        if (response.data.redirectUrl === 'homePasien') {
          router.push('/homePasien');
        } else if (response.data.redirectUrl === 'homeDokter') {
          router.push('/homeDokter');
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const goToRegisterPage = () => {
    router.push('/registerPasien');
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

        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: var(--border-radius);
          border: 1.5px solid var(--blue-lighter);
          background-color: var(--input-bg);
          color: var(--gray-dark);
          transition: border-color var(--transition), box-shadow var(--transition);
          outline-offset: 2px;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
          border-color: var(--blue-light);
          box-shadow: 0 0 8px var(--blue-lighter);
          background-color: white;
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
          transition: background-color var(--transition), transform var(--transition);
        }

        button:hover,
        button:focus {
          background-color: #3b82f6;
          transform: scale(1.03);
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
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="udin@gmail.com" 
              required 
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" aria-label="Log in to your account">Sign In</button>
          </form>
          <div className="sign-up" onClick={goToRegisterPage}>
            Don't have an account? <span style={{ cursor: "pointer" }}>Sign Up</span>
          </div>
        </section>
      </div>
    </>
  );
};

export default LoginPage;