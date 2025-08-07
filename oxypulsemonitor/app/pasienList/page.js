'use client';
import BASE_URL from '@/app/lib/config';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    
    const userType = localStorage.getItem('userType');
    if (!userType || userType !== 'admin') {
      router.push('/loginAdmin');
      return;
    }

    
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/pasien_list_data.php`);
        const data = await response.json();
        if (data.status === 'success') {
          setPatients(data.patients);
        } else {
          alert('Error fetching patients: ' + data.message);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        alert('Error fetching patients: ' + error.message);
      }
    };

    fetchPatients();
    const interval = setInterval(() => {
      fetchPatients();
    }, 5000); 
  
    return () => clearInterval(interval);
  }, [router]);

  const handleDeletePatient = async (id) => {
    if (!confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pasien_id', id);

      const response = await fetch(`${BASE_URL}/delete_pasien.php`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        
        setPatients(patients.filter(patient => patient.id !== id));
        alert('Patient deleted successfully');
      } else {
        alert(data.message || 'Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Error deleting patient: ' + error.message);
    }
  };

  const handlePatientClick = (id) => {
    router.push(`/dataKesehatan?id=${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    router.push('/loginAdmin');
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        }

        .search-bar {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: var(--border-radius);
          border: 1.5px solid var(--blue-lighter);
          background-color: var(--input-bg);
          color: var(--gray-dark);
          margin-bottom: 3rem;
        }

        .welcome-message {
          font-size: 1.5rem;
          margin-bottom: 2rem;
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
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: var(--blue-light);
          color: white;
          font-weight: 600;
        }

        tr:hover {
          background-color: #f8fafc;
        }

        td a {
          color: var(--blue-light);
          text-decoration: none;
          cursor: pointer;
          font-weight: 500;
        }

        td a:hover {
          text-decoration: underline;
        }

        .delete-button {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          transition: background-color var(--transition);
        }

        .delete-button:hover {
          background-color: #dc2626;
        }

        .welcome-message {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--blue-light);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }

          .card-container {
            flex-direction: column;
            align-items: center;
          }

          .card {
            width: 100%;
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
        <h1 className='welcome-message'>List of Patients</h1>
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
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{index + 1}</td>
                  <td>
                    <a onClick={() => handlePatientClick(patient.id)}>
                      {patient.name}
                    </a>
                  </td>
                  <td>{patient.dob}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};


export default PatientListPage;
