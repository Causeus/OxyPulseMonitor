'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import withAuth from '../components/withAuth';

const DoctorDashboardPage = () => {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const router = useRouter();

  const filteredPatients = patients.filter(patient => 
    patient.nama_pasien.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    setDoctorName(userName);

    
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/home_dokter_data.php`);
        const data = await response.json();
        if (data.status === 'success') {
          setPatients(data.patients);
          setTotalPatients(data.totalPatients);
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
  }, []);

  const handleRequest = async (patientId) => {
    try {
      const formData = new FormData();
      formData.append('pasienId', patientId);
      formData.append('dokterId', localStorage.getItem('userId'));

      const response = await fetch(`${BASE_URL}/create_request_pasien.php`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Request sent successfully!');
      } else {
        alert(data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert('Failed to send request');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    router.push('/');
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
          overflow-y: auto;
          max-height: 100vh;
        }

        .card-container {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 2rem;
        }

        .chart-container-wrapper {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          margin-top: 2rem;
        }

        .chart-container {
          width: 48%;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
          transition: transform var(--transition);
        }

        .chart-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(96, 165, 250, 0.15);
        }

        .chart-container h2 {
          color: var(--blue-light);
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .card {
          background: white;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
          width: 30%;
          text-align: center;
          transition: all var(--transition);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(96, 165, 250, 0.15);
        }

        .card h3 {
          font-size: 1.5rem;
          color: var(--blue-light);
          margin-bottom: 0.5rem;
        }

        .card p {
          font-size: 1.2rem;
          color: var(--gray-dark);
          font-weight: 600;
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
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        tr:hover {
          background-color: #f8fafc;
        }

        .request-button {
          background-color: var(--blue-light);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--transition);
        }

        .request-button:hover:not(:disabled) {
          background-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .request-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
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
          transition: all var(--transition);
        }

        .search-bar:focus {
          border-color: var(--blue-light);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          outline: none;
        }

        .welcome-message {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--blue-light);
          font-weight: 600;
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
          <h1 className="welcome-message">Welcome, dr. {doctorName}!</h1>

          
          <div className="card-container">
            <div className="card">
              <h3>Total Registered Patients</h3>
              <p>{totalPatients}</p>
            </div>
          </div>

        
          <input 
            type="text" 
            placeholder="Search by Patient Name" 
            className="search-bar" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />

          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td style={{ 
                      color: patient.status === 'Assigned' ? '#ef4444' : 
                             patient.status === 'Pending' ? '#f59e0b' : 
                             '#10b981'
                    }}>
                      {patient.nama_pasien}
                    </td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: patient.status === 'Assigned' ? '#fee2e2' : 
                                       patient.status === 'Pending' ? '#fef3c7' : 
                                       '#d1fae5',
                        color: patient.status === 'Assigned' ? '#ef4444' : 
                               patient.status === 'Pending' ? '#f59e0b' : 
                               '#10b981'
                      }}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="request-button"
                        onClick={() => handleRequest(patient.id)}
                        disabled={patient.status === 'Assigned'}
                        style={{
                          opacity: patient.status === 'Assigned' ? 0.5 : 1,
                          cursor: patient.status === 'Assigned' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {patient.status === 'Assigned' ? 'Already Assigned' : 'Request'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
};

export default withAuth(DoctorDashboardPage, 'dokter');
