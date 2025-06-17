'use client';
import BASE_URL from '@/app/lib/config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [spo2, setSpo2] = useState(null);
  const [bpm, setBpm] = useState(null);
  const [diagnosa, setDiagnosa] = useState(null);
  const [patientName, setPatientName] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userType = localStorage.getItem('userType');

    if (!userId || userType !== 'pasien') {
      router.push('/');
      return;
    }

    setPatientName(userName);

    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/home_pasien_data.php?patient_id=${userId}`);
        const data = await response.json();
        if (data.status === 'success') {
          setSpo2(data.spo2 || 'N/A');
          setBpm(data.bpm || 'N/A');
          setDiagnosa(data.diagnosa || 'No diagnosis available');
        }

        
        const historyResponse = await fetch(`${BASE_URL}/history_pasien_data.php?patient_id=${userId}`);
        const historyData = await historyResponse.json();
        if (historyData.status === 'success') {
          setHistoryData(historyData.history);
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

  
  const get7DaysAgo = () => {
    const today = new Date();
    today.setDate(today.getDate() - 7);  
    return today;
  };

  
  const filteredHistoryData = historyData.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= get7DaysAgo();
  });

  
  const spo2Data = {
    labels: filteredHistoryData.map(entry => entry.date),
    datasets: [
      {
        label: 'SPO2 (%)',
        data: filteredHistoryData.map(entry => entry.spo2),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const bpmData = {
    labels: filteredHistoryData.map(entry => entry.date),
    datasets: [
      {
        label: 'BPM',
        data: filteredHistoryData.map(entry => entry.bpm),
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
    ],
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

        .welcome-message {
          font-weight: 600;
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
        }

        .chart-container h2 {
          color: var(--blue-light);
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .card-container .card {
          width: 30%;
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
          <h1 className="welcome-message">Welcome, {patientName}!</h1>

          <div className="latest-data">Latest Data</div>

          <div className="card-container">
            <div className="card">
              <h3>Oxygen Levels (SPO2)</h3>
              <p>{spo2}%</p>
            </div>
            <div className="card">
              <h3>Heart Rate (BPM)</h3>
              <p>{bpm} BPM</p>
            </div>
            <div className="card">
              <h3>Diagnosis</h3>
              <p>{diagnosa}</p>
            </div>
          </div>

          <div className="chart-container-wrapper">
            <div className="chart-container">
              <h2>Oxygen Levels Graph (Last 7 Days)</h2>
              <Line data={spo2Data} />
            </div>

            <div className="chart-container">
              <h2>Heart Rate Graph (Last 7 Days)</h2>
              <Line data={bpmData} />
            </div>
          </div>
        </div>
      </div>

      <button className="logout-button" onClick={() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        router.push('/');
      }}>
        Logout
      </button>
    </>
  );
};

export default DashboardPage;
