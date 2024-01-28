'use client';
import { useEffect, useState } from 'react';
import SignIn from './components/SignIn.jsx';
import Calendar from './components/Calendar.jsx';

export default function Home() {
  const [userId, setUserId] = useState();

  useEffect(() => {
    const onStorage = () => setUserId(localStorage.getItem('userId'));

    setUserId(localStorage.getItem('userId'));
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div style={{ height: '-webkit-fill-available' }}>
      {!userId && <SignIn />}
      {userId && <Calendar userId={userId} />}
    </div>
  );
}
