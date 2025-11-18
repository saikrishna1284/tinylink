import '../styles/globals.css';

export const metadata = {
  title: 'TinyLink',
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>
          <h1>TinyLink URL Shortener</h1>
          <hr />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
