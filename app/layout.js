import './globals.css';

export const metadata = { title: 'Calendar', description: 'An incredible calendar for you' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
