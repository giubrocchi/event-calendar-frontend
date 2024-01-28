import { useState } from 'react';
import styles from './EventModal.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function EditEventModal({ setIsEditEventModalOpen, eventToEdit }) {
  const [startDate, setStartDate] = useState(eventToEdit?.startDate);
  const [finishDate, setFinishDate] = useState(eventToEdit?.finishDate);
  const [description, setDescription] = useState(eventToEdit?.description);
  const [color, setColor] = useState(eventToEdit?.color);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(`http://localhost:8080/event/${eventToEdit?._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        finishDate,
        description,
        color,
        userId: eventToEdit?.organizer,
        eventId: eventToEdit?._id,
      }),
    });

    if (response.ok) {
      setIsEditEventModalOpen(false);
      window.dispatchEvent(new Event('eventChange'));
    } else toast.error(response.text());
  }

  async function deleteEvent(event) {
    event.preventDefault();

    const response = await fetch(`http://localhost:8080/event/${eventToEdit?._id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setIsEditEventModalOpen(false);
      window.dispatchEvent(new Event('eventChange'));
    } else toast.error(response.text());
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackground}>
        <button className={styles.closeButton} onClick={() => setIsEditEventModalOpen(false)}>
          X
        </button>
        <h1 className={styles.modalTitle}>Edit event</h1>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <label className={styles.formLabel}>Start date</label>
          <input
            type="datetime-local"
            value={startDate}
            onInput={(event) => setStartDate(event.target.value)}
            className={styles.formInput}
            required
          />
          <label className={styles.formLabel}>Finish date</label>
          <input
            type="datetime-local"
            value={finishDate}
            onInput={(event) => setFinishDate(event.target.value)}
            min={startDate}
            className={styles.formInput}
            required
          />
          <label className={styles.formLabel}>Description</label>
          <input
            type="text"
            value={description}
            maxLength={50}
            onInput={(event) => setDescription(event.target.value)}
            className={styles.formInput}
            required
          />
          <label className={styles.formLabel}>Color</label>
          <input
            type="color"
            value={color}
            onInput={(event) => setColor(event.target.value)}
            required
          />
          <div className={styles.buttonContainer}>
            <button className={`${styles.formButton} ${styles.confirmButton}`} type="submit">
              Confirm
            </button>
            <button
              className={`${styles.formButton} ${styles.deleteButton}`}
              type="button"
              onClick={deleteEvent}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
