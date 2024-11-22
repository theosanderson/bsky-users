import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Embed() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/stats');
        setUserCount(response.data.last_user_count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="embed-container">
      <h1 className="text-2xl font-bold text-sky-600 mb-4">Bluesky User Count</h1>
      <p className="text-lg text-sky-700">{userCount.toLocaleString()} users</p>
    </div>
  );
}
