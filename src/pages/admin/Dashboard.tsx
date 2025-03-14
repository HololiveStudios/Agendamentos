import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Bem-vindo ao Sistema de Agendamento
          </h1>
          <p className="text-gray-600">
            Por favor, faça login para acessar o painel administrativo.
          </p>
          <button
            onClick={() => {}}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Login com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Dashboard</h1>
      {/* Dashboard content will be implemented in the next steps */}
    </div>
  );
}