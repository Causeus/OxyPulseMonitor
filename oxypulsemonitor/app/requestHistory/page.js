'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import withAuth from '../components/withAuth';

const RequestHistoryPage = () => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    
    const fetchRequests = async () => {
      try {
        const url = searchQuery 
          ? `${BASE_URL}/request_history_data.php?search=${encodeURIComponent(searchQuery)}`
          : `${BASE_URL}/request_history_data.php`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests();
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

  const getStatusText = (status) => {
    
    const statusNum = parseInt(status);
    
    switch (statusNum) {
      case 0:
        return 'Rejected';
      case 1:
        return 'Accepted';
      case 2:
        return 'Pending';
      default:
        return 'Unknown';
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
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
          background: white;
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--shadow-light);
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

        .status-pending {
          color: #f59e0b;
          font-weight: 600;
        }

        .status-rejected {
          color: #ef4444;
          font-weight: 600;
        }

        .status-accepted {
          color: #10b981;
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
          <h1 className="page-title">Request History</h1>

          
          <input 
            type="text" 
            placeholder="Search by patient name" 
            className="search-bar" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />

          
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Patients Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{request.nama_pasien}</td>
                  <td className={
                    request.status === 0 ? 'status-rejected' : 
                    request.status === 1 ? 'status-accepted' : 
                    'status-pending'
                  }>
                    {getStatusText(request.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default withAuth(RequestHistoryPage, 'dokter');

