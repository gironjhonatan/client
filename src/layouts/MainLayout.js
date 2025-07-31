import Header from '../components/Header';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: '2rem' }}>{children}</main>
    </>
  );
}
