'use client';  
import BASE_URL from '@/app/lib/config';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateofbirth, setDateofbirth] = useState('');
  const [device_id, setDeviceId] = useState('');
  const [isConfirmVisible, setIsConfirmVisible] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsConfirmVisible(true);
  };

  const handleConfirm = async () => {
    const patientData = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      dateofbirth: dateofbirth,
      device_id: device_id
    };

    try {
      console.log('Sending data:', patientData);
      const response = await axios.post(`${BASE_URL}/register_pasien.php`, patientData);
      console.log('Response:', response.data); 

      if (response.data.status === 'success') {
        alert(response.data.message);
        router.push('/');
      } else {
        alert(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      alert(error.response?.data?.message || "An error occurred, please try again.");
    }

    setIsConfirmVisible(false);
  };

  const handleCancel = () => {
    setIsConfirmVisible(false);
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
        
        .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .popup-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .popup-content button {
            margin: 10px;
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

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="tel"],
        input[type="date"],
        input[type="text"] {
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

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="tel"]:focus 
        input[type="date"]:focus{
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
          .register-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="container" role="main">
        <section className="register-card" aria-label="Register form">
          <h1>Register Patient</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Udin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="udin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label htmlFor="date">Date of Birth</label>
            <input
              id="date"
              name="date"
              type="date"
              value={dateofbirth}
              onChange={(e) => setDateofbirth(e.target.value)}
              required
            />

            <label htmlFor="device_id">Device ID</label>
            <input
              id="device_id"
              name="device_id"
              type="text"
              placeholder="Your device ID"
              value={device_id}
              onChange={(e) => setDeviceId(e.target.value)}
              required
            />

            <button type="submit" aria-label="Create an account">Register</button>
          </form>
        </section>
      </div>

      {isConfirmVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirm Your Data</h2>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Date of Birth:</strong> {dateofbirth}</p>
            <p><strong>Device ID:</strong> {device_id}</p>
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;