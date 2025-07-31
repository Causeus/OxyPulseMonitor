'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '../components/withAuth';

const DataKesehatan = () => {
  const [healthData, setHealthData] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [patientName, setPatientName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id');

  useEffect(() => {
    if (!patientId) {
      router.push('/pasienList');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/data_kesehatan_pasien.php?patient_id=${patientId}`);
        const data = await response.json();
        if (data.status === 'success') {
          setHealthData(data.health_data);
          setFilteredData(data.health_data);
          setPatientName(data.patient_name);
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
  }, [patientId, router]);

  useEffect(() => {
    if (searchDate) {
      const filtered = healthData.filter(entry =>
        entry.date.includes(searchDate)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(healthData);
    }
  }, [searchDate, healthData]);

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
          padding: 2rem;
        }

        .back-button {
          padding: 0.75rem 1.5rem;
          background-color: var(--blue-light);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          margin-bottom: 1rem;
          font-weight: 600;
          transition: all var(--transition);
        }

        .back-button:hover {
          background-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

        .table-container {
          max-height: 60vh;
          overflow-y: auto;
          margin-top: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
        }

        .health-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .health-table th {
          position: sticky;
          top: 0;
          background-color: var(--blue-light);
          color: white;
          font-weight: 600;
          z-index: 1;
          padding: 1rem;
          text-align: left;
        }

        .health-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          transition: all var(--transition);
        }

        .health-table tr:hover td {
          background-color: #f3f4f6;
        }

        .title {
          font-size: 1.5rem;
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
        <button 
          className="back-button" 
          onClick={() => router.push('/pasienList')}
        >
          Back to Patient List
        </button>

        <h1 className="title">Health Data for {patientName}</h1>

        <div className="search-bar">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search by Date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="health-table">
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
    </>
  );
};

export default withAuth(DataKesehatan, 'admin');