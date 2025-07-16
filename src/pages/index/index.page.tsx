import { Link } from '@tanstack/react-router';
import Button from '@mui/material/Button';

export function IndexPage() {
  return (
    <div className="p-2 flex flex-col gap-4">
      <Link to="/about">About</Link>

      <Button variant="contained" className="bg-pink-600 animate-bounce">
        MUI Button
      </Button>

      <p className="text-gray-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste delectus necessitatibus sunt corrupti labore
        quibusdam iusto minus! Neque adipisci nemo facilis voluptatibus. Eius ducimus assumenda repudiandae incidunt
        facere, ut corrupti?
      </p>
    </div>
  );
}
