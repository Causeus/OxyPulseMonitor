'use client';
import BASE_URL from '@/app/lib/config';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    
    const userType = localStorage.getItem('userType');
    if (!userType || userType !== 'admin') {
      router.push('/loginAdmin');
      return;
    }

    
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dokter_list_data.php`);
        const data = await response.json();
        if (data.status === 'success') {
          setDoctors(data.doctors);
        } else {
          console.error("Error fetching doctors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
    const interval = setInterval(() => {
      fetchData();
    }, 5000); 
  
    return () => clearInterval(interval);
  }, [router]);

  const handleDeleteDoctor = async (id) => {
    try {
      
      const formData = new FormData();
      formData.append('dokter_id', id);

      const response = await fetch(`${BASE_URL}/delete_dokter.php`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status === 'success') {
        
        setDoctors(doctors.filter(doctor => doctor.id !== id));
        alert('Doctor deleted successfully');
      } else {
        alert(data.message || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Error deleting doctor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    router.push('/loginAdmin');
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          overflow-y: auto;
        }

        .latest-data {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--blue-light);
          margin-bottom: 2rem;
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

        .search-bar {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: var(--border-radius);
          border: 1.5px solid var(--blue-lighter);
          background-color: var(--input-bg);
          color: var(--gray-dark);
          margin-bottom: 2rem;
        }

        .welcome-message {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--blue-light);
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

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
          background-color: white;
          box-shadow: var(--shadow-light);
          border-radius: var(--border-radius);
          overflow: hidden;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          background-color: var(--blue-light);
          color: white;
          font-weight: 600;
        }

        tr:hover {
          background-color: #f3f4f6;
        }

        .delete-button {
          padding: 0.5rem 1rem;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color var(--transition);
        }

        .delete-button:hover {
          background-color: #dc2626;
        }

        .register-button {
          padding: 0.75rem 2rem;
          background-color: var(--blue-light);
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          border: none;
          transition: background-color var(--transition), transform var(--transition);
        }

        .register-button:hover {
          background-color: #3b82f6;
          transform: scale(1.03);
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            height: auto;
          }

          .main-content {
            padding: 1rem;
          }

          table {
            display: block;
            overflow-x: auto;
          }
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
          <h1 className='welcome-message'>List of Doctors</h1>
          <input 
            type="text" 
            placeholder="Search by Name" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="search-bar"
          />

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td>{index + 1}</td>
                  <td>dr. {doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.admin_name}</td>
                  <td>
                    <button 
                      className="delete-button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this doctor?')) {
                          handleDeleteDoctor(doctor.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button 
            className="register-button" 
            onClick={() => router.push('/registerDokter')}
          >
            Register Doctor
          </button>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default DoctorListPage;
