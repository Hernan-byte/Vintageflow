import Link from 'next/link';

export default function Pie() {
  return (
    <footer className="foot">
      <div className="wrap">
        <Link className="brand" href="/">
          vintage flow
        </Link>
        <span>© {new Date().getFullYear()} Vintage Flow · Ropa vintage y de segunda mano</span>
      </div>
    </footer>
  );
}
