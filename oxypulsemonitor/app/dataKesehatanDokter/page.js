'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import withAuth from '../components/withAuth';

const DataKesehatanDokterPage = () => {
  const [healthData, setHealthData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id');

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const url = searchQuery 
          ? `${BASE_URL}/data_kesehatan_dokter.php?patientId=${patientId}&search=${encodeURIComponent(searchQuery)}`
          : `${BASE_URL}/data_kesehatan_dokter.php?patientId=${patientId}`;
        
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
          setHealthData(data.data);
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    if (patientId) {
      fetchHealthData();
      const interval = setInterval(() => {
        fetchData();
      }, 5000); 
    
      return () => clearInterval(interval);
    }
  }, [patientId, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const handleSaveNotes = async (dataId) => {
    try {
      const response = await fetch(`${BASE_URL}/update_catatan_dokter.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorNotes,
          dataId,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setIsEditing(false);
        setEditingIndex(null);
        setDoctorNotes('');
        
        const refreshResponse = await fetch(`${BASE_URL}/data_kesehatan_dokter.php?patientId=${patientId}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.status === 'success') {
          setHealthData(refreshData.data);
        }
      }
    } catch (error) {
      console.error("Error saving doctor notes:", error);
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

        .doctor-notes {
          margin-top: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
        }

        .doctor-notes h3 {
          margin-bottom: 1rem;
          color: var(--gray-dark);
        }

        .notes-textarea {
          width: 100%;
          min-height: 150px;
          padding: 1rem;
          border: 1.5px solid var(--blue-lighter);
          border-radius: var(--border-radius);
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          resize: vertical;
          transition: all var(--transition);
        }

        .notes-textarea:disabled {
          background-color: var(--input-bg);
          cursor: not-allowed;
        }

        .notes-textarea:focus {
          border-color: var(--blue-light);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          outline: none;
        }

        .notes-actions {
          margin-top: 1rem;
          display: flex;
          gap: 1rem;
        }

        .notes-button {
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          border: none;
        }

        .edit-button {
          background-color: var(--blue-light);
          color: white;
        }

        .edit-button:hover {
          background-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .save-button {
          background-color: #10b981;
          color: white;
        }

        .save-button:hover {
          background-color: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .cancel-button {
          background-color: #ef4444;
          color: white;
        }

        .cancel-button:hover {
          background-color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
          <h1 className="page-title">Patient Health Data</h1>

          
          <input 
            type="text" 
            placeholder="Search by date" 
            className="search-bar" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />

          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Date</th>
                  <th>SpO2</th>
                  <th>BPM</th>
                  <th>Diagnosis</th>
                  <th>Doctor's note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {healthData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.timestamp}</td>
                    <td>{data.spo2}%</td>
                    <td>{data.bpm}</td>
                    <td>{data.diagnosa}</td>
                    <td>
                      {isEditing && editingIndex === index ? (
                        <textarea
                          className="notes-textarea"
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          placeholder="Add your notes here..."
                        />
                      ) : (
                        data.catatan_dokter || '-'
                      )}
                    </td>
                    <td>
                      {!isEditing ? (
                        <button 
                          className="notes-button edit-button"
                          onClick={() => {
                            setIsEditing(true);
                            setEditingIndex(index);
                            setDoctorNotes(data.catatan_dokter || '');
                          }}
                        >
                          Edit
                        </button>
                      ) : editingIndex === index ? (
                        <>
                          <button 
                            className="notes-button save-button"
                            onClick={() => handleSaveNotes(data.id)}
                          >
                            Save
                          </button>
                          <button 
                            className="notes-button cancel-button"
                            onClick={() => {
                              setIsEditing(false);
                              setEditingIndex(null);
                              setDoctorNotes('');
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : null}
                    </td>
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

export default withAuth(DataKesehatanDokterPage, 'dokter'); 