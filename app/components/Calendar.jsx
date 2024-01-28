import { useState, useEffect } from 'react';
import AddEventModal from './AddEventModal.jsx';
import CalendarDay from './CalendarDay.jsx';
import styles from './Calendar.module.css';
import { CiLogout } from 'react-icons/ci';
import { IconContext } from 'react-icons';

export default function Calendar({ userId }) {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [previousMonthDays, setPreviousMonthDays] = useState([]);
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [nextMonthDays, setNextMonthDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  useEffect(() => {
    async function getEvents() {
      const response = await fetch(`http://localhost:8080/event/calendar/${userId}`);
      const jsonResponse = (await response.json()) ?? [];

      setEvents(jsonResponse);
    }

    const onEventsChange = () => getEvents();

    window.addEventListener('eventChange', onEventsChange);
    getEvents();

    return () => window.removeEventListener('eventChange', onEventsChange);
  }, []);

  useEffect(() => {
    getPreviousMonthDays();
    getCurrentMonthDays();
    getNextMonthDays();
  }, [currentMonth]);

  function getPreviousMonthDays() {
    let days = [];
    const firstMonthDate = new Date(`${currentMonth + 1}/1/${currentYear}`);

    for (let day = 1; day <= firstMonthDate.getDay(); day++) {
      const newDate = new Date(firstMonthDate);

      newDate.setDate(newDate.getDate() - day);
      days.unshift(new Date(newDate));
    }

    setPreviousMonthDays(days);
  }

  function getCurrentMonthDays() {
    const newDate = new Date(`${currentMonth + 1}/1/${currentYear}`);
    let days = [];

    while (newDate.getMonth() === currentMonth) {
      days.push(new Date(newDate));
      newDate.setDate(newDate.getDate() + 1);
    }

    setCurrentMonthDays(days);
  }

  function getNextMonthDays() {
    let days = [];
    const firstMonthDate = new Date(
      `${currentMonth === 11 ? 1 : currentMonth + 2}/1/${
        currentMonth === 11 ? currentYear + 1 : currentYear
      }`
    );
    const newDate = new Date(firstMonthDate);

    for (let day = firstMonthDate.getDay(); day < 7; day++) {
      days.push(new Date(newDate));
      newDate.setDate(newDate.getDate() + 1);
    }

    setNextMonthDays(days);
  }

  function setToPreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);

      return;
    }

    setCurrentMonth(currentMonth - 1);
  }

  function setToNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);

      return;
    }

    setCurrentMonth(currentMonth + 1);
  }

  function getEventsFromDay(date) {
    return events.filter((event) => {
      const startDate = new Date(event.startDate);
      const finishDate = new Date(event.finishDate);

      if (isSameDay(date, startDate) || isSameDay(date, finishDate)) return true;

      return startDate < date && finishDate > date;
    });
  }

  function isSameDay(dateA, dateB) {
    if (dateA.getFullYear() !== dateB.getFullYear()) return false;
    if (dateA.getMonth() !== dateB.getMonth()) return false;
    if (dateA.getDate() !== dateB.getDate()) return false;

    return true;
  }

  function logout() {
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <div className={styles.backgroundContainer}>
      <div>
        <button className={styles.addButton} onClick={() => setIsAddEventModalOpen(true)}>
          +
        </button>
        <button className={styles.logoutButton} onClick={logout}>
          <IconContext.Provider value={{ color: 'black', size: 20 }}>
            <CiLogout />
          </IconContext.Provider>
        </button>
      </div>
      {isAddEventModalOpen && (
        <AddEventModal setIsAddEventModalOpen={setIsAddEventModalOpen} userId={userId} />
      )}
      <h2 className={styles.yearTitle}>{currentYear}</h2>
      <div className={styles.monthTitle}>
        <button className={styles.changeMonthButton} onClick={setToPreviousMonth}>
          &lt;
        </button>
        <h1>{months[currentMonth]}</h1>
        <button className={styles.changeMonthButton} onClick={setToNextMonth}>
          &gt;
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weekdays.map((day, index) => (
          <div className={styles.weekdayTitle} key={index}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.calendarContainer}>
        {previousMonthDays.map((day, index) => (
          <CalendarDay
            key={index}
            date={day}
            isCurrentMonth={false}
            events={getEventsFromDay(day)}
          />
        ))}
        {currentMonthDays.map((day, index) => (
          <CalendarDay
            key={index}
            date={day}
            isCurrentMonth={true}
            events={getEventsFromDay(day)}
          />
        ))}
        {nextMonthDays.map((day, index) => (
          <CalendarDay
            key={index}
            date={day}
            isCurrentMonth={false}
            events={getEventsFromDay(day)}
          />
        ))}
      </div>
    </div>
  );
}
