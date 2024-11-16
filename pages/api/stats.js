import { Pool } from 'pg';
import axios from 'axios';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
    mode: process.env.DB_SSL_MODE
  }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Set Cache-Control header for 60 seconds
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=15');
    
    try {
      // Check the latest entry
      const latestEntryResult = await pool.query('SELECT timestamp, users FROM stats ORDER BY timestamp DESC LIMIT 1');
      const latestEntry = latestEntryResult.rows[0];
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (!latestEntry || (currentTimestamp - latestEntry.timestamp) > 10) {
        // Fetch new data
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL);
        const totalUsers = response.data.total_users;

        // Only insert if the number has changed or there's no previous entry
        if (!latestEntry || totalUsers !== latestEntry.users) {
          await pool.query('INSERT INTO stats (timestamp, users) VALUES ($1, $2)', [currentTimestamp, totalUsers]);
        }
      }

      // Retrieve the last 30 entries
      const result = await pool.query('SELECT timestamp, users FROM stats ORDER BY timestamp DESC LIMIT 10');
      const entries = result.rows.reverse(); // Reverse to get chronological order

      if (entries.length < 10) {
        res.status(200).json({ message: 'Not enough data to calculate growth rate' });
        return;
      }

      // Calculate growth rate using the last 10 entries
      const lastTenEntries = entries;
      let totalGrowthRate = 0;
      let totalTimeDiff = 0;

      for (let i = 1; i < lastTenEntries.length; i++) {
        const prevEntry = lastTenEntries[i - 1];
        const currEntry = lastTenEntries[i];
        const timeDiff = currEntry.timestamp - prevEntry.timestamp;
        const userDiff = currEntry.users - prevEntry.users;
        
        if (timeDiff > 0) {
          totalGrowthRate += userDiff / timeDiff;
          totalTimeDiff += timeDiff;
        }
      }

      const averageGrowthPerSecond = totalTimeDiff > 0 ? totalGrowthRate / (lastTenEntries.length - 1) : 0;

      res.status(200).json({
        last_timestamp: entries[entries.length - 1].timestamp,
        last_user_count: entries[entries.length - 1].users,
        growth_per_second: averageGrowthPerSecond,
        random: Math.random()
      });

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}