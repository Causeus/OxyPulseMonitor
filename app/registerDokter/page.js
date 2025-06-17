'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RegisterDoctorPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  
  useEffect(() => {
    
    const userType = localStorage.getItem('userType');
    if (!userType || userType !== 'admin') {
      router.push('/loginAdmin');
      return;
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const adminId = localStorage.getItem('userId');
      if (!adminId) {
        alert('Please login as admin first');
        router.push('/loginAdmin');
        return;
      }
      
      const response = await fetch(`${BASE_URL}/register_dokter.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          admin_id: adminId
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Doctor registered successfully!');
        router.push('/dokterList');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering doctor:', error);
      alert('Error registering doctor');
    }
  };

  const goBackToHome = () => {
    router.push('/homeAdmin');
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

        .register-card {
          background: white;
          padding: 2.5rem 3rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
          width: 100%;
          max-width: 500px;
          text-align: center;
          transition: transform var(--transition);
        }

        .register-card:hover {
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
        input[type="email"],
        input[type="password"],
        input[type="tel"] {
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
        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="tel"]:focus {
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

        .back-button {
          background-color: #6b7280;
          margin-top: 1rem;
        }

        .back-button:hover {
          background-color: #4b5563;
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
          .register-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="container" role="main">
        <section className="register-card" aria-label="Register Doctor Form">
          <img src="/oxypulselogo.png"
            className="logo-image"
            alt="oxypulselogo"
          />
          <h1>Register Doctor</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="doctor's name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              autoComplete="name" 
            />

            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="doctor@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              autoComplete="email" 
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
              autoComplete="new-password" 
            />

            <label htmlFor="phone">Phone Number</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              placeholder="08123456789" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />

            <button type="submit">Register</button>
          </form>

          <button onClick={goBackToHome} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--blue-light)', textDecoration: 'underline', cursor: 'pointer' }}>
            Back to Home
          </button>
        </section>
      </div>
    </>
  );
};

export default RegisterDoctorPage;