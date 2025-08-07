'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import withAuth from '../components/withAuth';

const RequestAcceptPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const dokterId = localStorage.getItem('userId');
        const url = searchQuery 
          ? `${BASE_URL}/accepted_pasien_data.php?dokterId=${dokterId}&search=${encodeURIComponent(searchQuery)}`
          : `${BASE_URL}/accepted_pasien_data.php?dokterId=${dokterId}`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
          setPatients(data.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
    const interval = setInterval(() => {
      fetchPatients();
    }, 5000); 
  
    return () => clearInterval(interval);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const handlePatientClick = (patientId) => {
    router.push(`/dataKesehatanDokter?id=${patientId}`);
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
          transition: all var(--transition);
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
        }

        .menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .main-content {
          flex-grow: 1;
          padding: 2rem;
        }

        .page-title {
          font-size: 1.8rem;
          color: var(--gray-dark);
          margin-bottom: 2rem;
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
          transition: all var(--transition);
        }

        .search-bar:focus {
          border-color: var(--blue-light);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          outline: none;
        }

        .table-container {
          max-height: 60vh;
          overflow-y: auto;
          margin-top: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        th {
          position: sticky;
          top: 0;
          background-color: var(--blue-light);
          color: white;
          font-weight: 600;
          z-index: 1;
          padding: 1rem;
          text-align: left;
        }

        td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          transition: all var(--transition);
        }

        tr:hover {
          background-color: #f3f4f6;
          cursor: pointer;
        }

        .logout-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background-color: transparent;
          border: 1px solid #ef4444;
          padding: 0.75rem 1.5rem;
          color: #ef4444;
          cursor: pointer;
          border-radius: var(--border-radius);
          font-weight: 600;
          transition: all var(--transition);
        }

        .logout-button:hover {
          background-color: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 200px;
          }
        }
      `}</style>

      <div className="container">
        
        <div className="sidebar">
          <h2>Doctor Dashboard</h2>
          <div className="menu">
            <Link href="/homeDokter" passHref>
              <div className="menu-item">Home</div>
            </Link>
            <Link href="/requestHistory" passHref>
              <div className="menu-item">Request History</div>
            </Link>
            <Link href="/requestAccept" passHref>
              <div className="menu-item">Accepted Request</div>
            </Link>
          </div>
        </div>

        
        <div className="main-content">
          <h1 className="page-title">Accepted Patients</h1>

          
          <input 
            type="text" 
            placeholder="Search by patient name" 
            className="search-bar" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />

          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Patients Name</th>
                  <th>Date of Birth</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index} onClick={() => handlePatientClick(patient.id)}>
                    <td>{index + 1}</td>
                    <td>{patient.nama}</td>
                    <td>{patient.tanggal_lahir}</td>
                    <td>{patient.no_telp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(RequestAcceptPage, 'dokter');

