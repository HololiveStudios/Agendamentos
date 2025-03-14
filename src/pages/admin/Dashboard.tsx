import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Settings, 
  PlusCircle, 
  Clock, 
  LogOut, 
  Menu, 
  X, 
  Home,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Import subpages
import AdminCalendar from './Calendar';
import AdminCustomers from './Customers';
import AdminServices from './Services';
import AdminSettings from './Settings';
import AdminHome from './Home';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchBusinessData() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setBusiness(data);
          // If we're at the root admin page, redirect to the correct slug
          if (!slug && data.slug) {
            navigate(`/${data.slug}`);
          }
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do negócio.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBusinessData();
  }, [user, slug, navigate, toast]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível sair da conta.',
        variant: 'destructive',
      });
    }
  };

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
            onClick={() => navigate('/login')}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Acessar
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed left-4 top-4 z-50 block rounded-full bg-indigo-600 p-2 text-white shadow-lg lg:hidden"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Business Name */}
          <div className="flex items-center space-x-3 border-b border-gray-200 p-4">
            {business?.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                {business?.business_name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="font-medium text-gray-900">{business?.business_name || 'Meu Negócio'}</div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  to={`/${slug}`} 
                  className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Home className="h-5 w-5 text-gray-500" />
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${slug}/agenda`} 
                  className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>Agenda</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${slug}/clientes`} 
                  className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>Clientes</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${slug}/servicos`} 
                  className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>Serviços</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/${slug}/configuracoes`} 
                  className="flex items-center space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                  <span>Configurações</span>
                </Link>
              </li>
            </ul>

            <div className="mt-8 rounded-lg bg-indigo-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-indigo-800">Seu Link de Agendamento</h3>
              <div className="flex items-center rounded-md bg-white p-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/${slug}/agendar`}
                  className="flex-1 border-none bg-transparent text-sm text-gray-800 outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${slug}/agendar`);
                    toast({
                      title: 'Link copiado!',
                      description: 'Link de agendamento copiado para a área de transferência.',
                    });
                  }}
                  className="ml-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Copiar
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 p-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="agenda" element={<AdminCalendar />} />
            <Route path="clientes" element={<AdminCustomers />} />
            <Route path="servicos" element={<AdminServices />} />
            <Route path="configuracoes" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}