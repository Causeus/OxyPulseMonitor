'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HistoryPasien = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/history_pasien_data.php?patient_id=${userId}`);
        const data = await response.json();
        if (data.status === 'success') {
          setHistoryData(data.history);
          setFilteredData(data.history);
        } else {
          alert('Failed to fetch data');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert('Error fetching data');
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000); 
  
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (searchDate) {
      const filtered = historyData.filter(entry =>
        entry.date.includes(searchDate)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(historyData);
    }
  }, [searchDate, historyData]);

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

        body, html {
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

        .search-bar {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .search-input {
          padding: 0.75rem 1rem;
          width: 200px;
          font-size: 1rem;
          border-radius: var(--border-radius);
          border: 1.5px solid var(--blue-lighter);
          background-color: var(--input-bg);
          color: var(--gray-dark);
          transition: all var(--transition);
        }

        .search-input:focus {
          border-color: var(--blue-light);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
          outline: none;
        }

        .history-table-container {
          max-height: 60vh;
          overflow-y: auto;
          margin-top: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .history-table th {
          position: sticky;
          top: 0;
          background-color: var(--blue-light);
          color: white;
          font-weight: 600;
          z-index: 1;
          padding: 1rem;
          text-align: center;
        }

        .history-table td {
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          transition: all var(--transition);
        }

        .history-table tr:hover td {
          background-color: #f3f4f6;
        }

        .history-title {
          font-size: 2rem;
          font-weight: 600;
          color: var(--blue-light);
          margin-bottom: 1rem;
        }

        .catatan-dokter {
          display: inline-block;
          padding: 0.5rem;
          border-radius: var(--border-radius);
          background-color: #f3f4f6;
          color: var(--gray-dark);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .catatan-dokter.empty {
          background-color: #fee2e2;
          color: #ef4444;
          font-style: italic;
        }
      `}</style>

      <div className="container">
        <div className="sidebar">
          <h2>Patient Dashboard</h2>
          <div className="menu">
            <div className="menu-item" onClick={() => router.push('/homePasien')}>Home</div>
            <div className="menu-item" onClick={() => router.push('/historyPasien')}>History</div>
            <div className="menu-item" onClick={() => router.push('/requestPasien')}>Permission</div>
          </div>
        </div>

        <div className="main-content">
          <h1 className="history-title">Health History</h1>

          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by Date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>SPO2</th>
                  <th>BPM</th>
                  <th>Diagnosis</th>
                  <th>Doctor's note</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{entry.spo2}</td>
                    <td>{entry.bpm}</td>
                    <td>{entry.diagnosa}</td>
                    <td>
                      <span className={`catatan-dokter ${!entry.catatan_dokter ? 'empty' : ''}`}>
                        {entry.catatan_dokter || 'No doctor’s notes yet'}
                      </span>
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

export default HistoryPasien;
