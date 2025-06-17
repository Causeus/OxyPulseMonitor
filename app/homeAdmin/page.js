'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

const AdminDashboardPage = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [adminName, setAdminName] = useState('');
  const router = useRouter();

  useEffect(() => {
    
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    if (!userType || userType !== 'admin') {
      router.push('/loginAdmin');
      return;
    }

    setAdminName(userName);

    
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/home_admin_data.php`);
        const data = await response.json();
        if (data.status === 'success') {
          setTotalDoctors(data.totalDoctors);
          setTotalPatients(data.totalPatients);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000); 
  
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    router.push('/loginAdmin');
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

        body, html {
          height: 100%;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #f9fafb;
          color: var(--gray-dark);
        }

        .container {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 250px;
          background-color: var(--blue-light);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2rem;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar h2 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }

        .menu {
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          font-size: 1.1rem;
          margin: 1rem 0;
          cursor: pointer;
          transition: color var(--transition);
        }

        .menu-item:hover {
          color: #3b82f6;
        }

        .main-content {
          flex-grow: 1;
          padding: 2rem;
        }

        .card-container {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 2rem;
        }

        .card {
          background: white;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
          width: 30%;
          text-align: center;
        }

        .card h3 {
          font-size: 1.5rem;
          color: var(--blue-light);
        }

        .card p {
          font-size: 1.2rem;
          color: var(--gray-dark);
        }

        .logout-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background-color: transparent;
          border: 1px solid red;
          padding: 0.5rem 1rem;
          color: red;
          cursor: pointer;
          border-radius: var(--border-radius);
          font-weight: 600;
        }

        .logout-button:hover {
          background-color: red;
          color: white;
        }

        .welcome-message {
          font-weight: 600;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--blue-light);
        }

      `}</style>

      <div className="container">
        
        <div className="sidebar">
          <h2>Admin Dashboard</h2>
          <div className="menu">
            <Link href="/homeAdmin" passHref>
              <div className="menu-item">Home</div>
            </Link>
            <Link href="/dokterList" passHref>
              <div className="menu-item">Doctor List</div>
            </Link>
            <Link href="/pasienList" passHref>
              <div className="menu-item">Patient List</div>
            </Link>
          </div>
        </div>

        
        <div className="main-content">
          <h1 className='welcome-message'>Welcome, {adminName}!</h1>

          
          <div className="card-container">
            <div className="card">
              <h3>Total Registered Doctors</h3>
              <p>{totalDoctors}</p>
            </div>
            <div className="card">
              <h3>Total Registered Patients</h3>
              <p>{totalPatients}</p>
            </div>
          </div>
        </div>
      </div>

      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default AdminDashboardPage;
