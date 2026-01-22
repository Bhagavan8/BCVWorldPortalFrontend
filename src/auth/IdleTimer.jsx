import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const IdleTimer = ({ timeout = 15 * 60 * 1000 }) => { // Default: 15 minutes
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const handleLogout = () => {
      const user = localStorage.getItem('user');
      if (user) {
        localStorage.removeItem('user');
        toast.error('Session timed out due to inactivity.');
        navigate('/login');
      }
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleLogout, timeout);
    };

    // Initial timer start
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate, timeout]);

  return null;
};

export default IdleTimer;
