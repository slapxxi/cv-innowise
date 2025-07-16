import { Link } from '@tanstack/react-router';

export function IndexPage() {
  return (
    <div className="p-2">
      <Link to="/about">About</Link>
    </div>
  );
}
