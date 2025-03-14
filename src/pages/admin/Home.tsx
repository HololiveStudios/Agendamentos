import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, TrendingUp, DollarSign, Check, X } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useParams } from 'react-router-dom';

export default function AdminHome() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalCustomers: 0,
    totalServices: 0,
    monthlySales: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: businessData } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('slug', slug)
          .single();

        if (!businessData?.id) {
          throw new Error('Business not found');
        }

        // Fetch statistics
        const [
          { data: totalAppointments },
          { data: upcomingAppointments },
          { data: totalCustomers },
          { data: totalServices },
          { data: recentAppointmentsData },
        ] = await Promise.all([
          supabase
            .from('appointments')
            .select('count')
            .eq('business_id', businessData.id),
          supabase
            .from('appointments')
            .select('count')
            .eq('business_id', businessData.id)
            .gte('start_time', new Date().toISOString()),
          supabase
            .from('appointments')
            .select('customer_email')
            .eq('business_id', businessData.id)
            .then(({ data }) => ({
              data: data ? new Set(data.map(item => item.customer_email)).size : 0
            })),
          supabase
            .from('services')
            .select('count')
            .eq('business_id', businessData.id),
          supabase
            .from('appointments')
            .select(`
              id,
              customer_name,
              start_time,
              services:service_id (name, price)
            `)
            .eq('business_id', businessData.id)
            .order('start_time', { ascending: true })
            .limit(5),
        ]);

        // Calculate monthly sales (simplified)
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        
        const { data: monthlySalesData } = await supabase
          .from('appointments')
          .select('services:service_id (price)')
          .eq('business_id', businessData.id)
          .gte('start_time', monthStart.toISOString());

        const monthlySales = monthlySalesData 
          ? monthlySalesData.reduce((sum, item) => sum + (item.services?.price || 0), 0)
          : 0;

        setStats({
          totalAppointments: totalAppointments?.[0]?.count || 0,
          upcomingAppointments: upcomingAppointments?.[0]?.count || 0,
          totalCustomers,
          totalServices: totalServices?.[0]?.count || 0,
          monthlySales,
        });

        if (recentAppointmentsData) {
          setRecentAppointments(recentAppointmentsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do dashboard.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [slug, toast]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Agendamentos</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</h3>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">{stats.totalAppointments}</span> total
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Clientes</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">{stats.totalCustomers}</h3>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <Link to={`/${slug}/clientes`} className="text-green-600 hover:underline">
              Ver clientes
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Serviços</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">{stats.totalServices}</h3>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <Link to={`/${slug}/servicos`} className="text-purple-600 hover:underline">
              Gerenciar serviços
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Vendas (Mês)</p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900">
                R$ {stats.monthlySales.toFixed(2)}
              </h3>
            </div>
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
            <span>Projeção positiva</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-lg bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Próximos Agendamentos</h2>
        {recentAppointments.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cliente</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Serviço</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data/Hora</th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                          {appointment.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.customer_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4">
                      <div className="text-sm text-gray-900">{appointment.services?.name || 'N/A'}</div>
                    </td>
                    <td className="whitespace-nowrap py-4">
                      <div className="text-sm text-gray-900">{formatDateTime(appointment.start_time)}</div>
                    </td>
                    <td className="whitespace-nowrap py-4">
                      <div className="text-sm text-gray-900">R$ {appointment.services?.price?.toFixed(2) || '0.00'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="mb-3 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 text-lg font-medium text-gray-900">Nenhum agendamento próximo</h3>
            <p className="text-sm text-gray-500">
              Compartilhe seu link de agendamento com clientes para começar a receber reservas.
            </p>
          </div>
        )}

        <Link
          to={`/${slug}/agenda`}
          className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Ver todos os agendamentos
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}