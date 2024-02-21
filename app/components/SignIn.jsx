import { useState } from 'react';
import styles from './SignIn.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function SignIn() {
  const signInAction = 'signIn';
  const signUpAction = 'signUp';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [action, setAction] = useState(signInAction);

  async function handleSubmit(event) {
    event.preventDefault();

    if (action === signInAction) await signIn();

    if (action === signUpAction) await signUp();
  }

  async function signIn() {
    const url = 'http://localhost:8080/user/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.status !== 200) {
      toast.error(response.text());

      return;
    }

    const jsonResponse = (await response.json()) ?? {};

    localStorage.setItem('userId', jsonResponse.id);
    window.dispatchEvent(new Event('storage'));
  }

  async function signUp() {
    const url = 'http://localhost:8080/user/';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.status !== 200) {
      const jsonResponse = await response.json();

      toast.error(jsonResponse.message);

      return;
    }

    toast.success('Successfully signed up! You can now sign in :D');
    setUsername('');
    setPassword('');
    setAction(signInAction);
  }

  return (
    <div className={styles.background}>
      <h1>Calendar</h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>Username</label>
        <input
          type="text"
          maxLength={100}
          required
          className={styles.formInput}
          placeholder="Username"
          value={username}
          onInput={(event) => setUsername(event.target.value)}
        />
        <label className={styles.formLabel}>Password</label>
        <input
          type="password"
          maxLength={100}
          required
          className={styles.formInput}
          placeholder="Password"
          value={password}
          onInput={(event) => setPassword(event.target.value)}
        />
        <button type="submit" className={styles.formButton}>
          {action === signInAction ? 'Sign in' : 'Sign up'}
        </button>
        {action === signInAction && (
          <span className={styles.actionContainer}>
            Want to sign up?{' '}
            <b className={styles.actionButton} onClick={() => setAction(signUpAction)}>
              Click here
            </b>{' '}
            to create an account.
          </span>
        )}
        {action === signUpAction && (
          <span className={styles.actionContainer}>
            Already have an account?{' '}
            <b className={styles.actionButton} onClick={() => setAction(signInAction)}>
              {' '}
              Click here
            </b>{' '}
            to sign in.
          </span>
        )}
      </form>
      <Toaster />
    </div>
  );
}
