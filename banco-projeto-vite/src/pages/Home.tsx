import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Banco Digital</h1>
        <div className="space-y-4">

          <Link to="/create-account" className="block w-full bg-green-500 text-white py-2 px-4 rounded-md text-center hover:bg-green-600">
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}