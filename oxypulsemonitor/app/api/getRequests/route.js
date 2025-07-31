import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'oxypulsemonitor'
    });

    // Query to get requests with patient names, excluding accepted requests
    const [rows] = await connection.execute(`
      SELECT ip.id, ip.status, p.nama_pasien 
      FROM izin_pasien ip
      JOIN pasien p ON ip.pasienid = p.id
      WHERE ip.status IN (0, 2)
      ORDER BY ip.id DESC
    `);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 