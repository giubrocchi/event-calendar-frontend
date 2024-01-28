import { useState } from 'react';
import EditEventModal from './EditEventModal.jsx';
import styles from './CalendarDay.module.css';

export default function CalendarDay({ date, isCurrentMonth, events = [] }) {
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState({});

  const formattedEvents = events.map((event) => {
    const formatTime = (time) => time.toLocaleString('en-US', { minimumIntegerDigits: 2 });

    const startDate = new Date(event.startDate);
    const startHour =
      startDate < date
        ? '00:00'
        : `${formatTime(startDate.getHours())}:${formatTime(startDate.getMinutes())}`;

    const finishDate = new Date(event.finishDate);
    const finishHour =
      finishDate > new Date(`${date.toISOString().split('T')[0]}T23:59`)
        ? '23:59'
        : `${formatTime(finishDate.getHours())}:${formatTime(finishDate.getMinutes())}`;

    return { ...event, startHour, finishHour };
  });

  const sortedEvents = formattedEvents.sort((a, b) => {
    const placeholderDate = '2024-01-01';
    const timeA = new Date(`${placeholderDate}T${a.startHour}`);
    const timeB = new Date(`${placeholderDate}T${b.startHour}`);

    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;

    return 0;
  });

  function openEditEventModal(event) {
    setEventToEdit(event);
    setIsEditEventModalOpen(true);
  }

  return (
    <div className={styles.dayContainer}>
      {isEditEventModalOpen && (
        <EditEventModal
          setIsEditEventModalOpen={setIsEditEventModalOpen}
          eventToEdit={eventToEdit}
        />
      )}
      <span className={`${styles.topDate}${isCurrentMonth ? '' : ` ${styles.clearDate}`}`}>
        {date.getDate()}
      </span>
      <div className={styles.eventsBox}>
        {sortedEvents.map((event, index) => (
          <div
            className={styles.eventContainer}
            style={{ backgroundColor: event.color }}
            onClick={() => openEditEventModal(event)}
            key={index}
          >
            <span>
              {event.startHour} - {event.finishHour}
            </span>
            {event.description}
          </div>
        ))}
      </div>
    </div>
  );
}
