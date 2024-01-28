import { useState } from 'react';
import styles from './EventModal.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function AddEventModal({ setIsAddEventModalOpen, userId }) {
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#42c0ff');

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(`http://localhost:8080/event/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate, finishDate, description, color, organizer: userId }),
    });

    if (response.ok) {
      setIsAddEventModalOpen(false);
      window.dispatchEvent(new Event('eventChange'));
    } else toast.error(response.text());
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackground}>
        <button className={styles.closeButton} onClick={() => setIsAddEventModalOpen(false)}>
          X
        </button>
        <h1 className={styles.modalTitle}>Add event</h1>
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
          <button className={`${styles.formButton} ${styles.confirmButton}`} type="submit">
            Add
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
