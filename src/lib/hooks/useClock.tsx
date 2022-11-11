import { useEffect, useState } from "react";

export default function useClock(config?: {}) {
  const [time, setTime] = useState('00:00');
  const [date, setDate] = useState('seg., 00/00');

  useEffect(() => {
    const handler = () => {
      const today = new Date();
      const hours = today.getHours() < 10 ? '0'+today.getHours() : today.getHours();
      const minutes = today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes();
      const formatedDate = today.toLocaleDateString(['pt-br'], {weekday:'short', month:'numeric', day:'numeric'})

      setTime(`${hours}:${minutes}`);
      setDate(formatedDate);
    }
    
    handler();

    const interval = setInterval(handler, 15000);

    return () => clearInterval(interval);
  }, [])

  return {
    time,
    date
  }
}