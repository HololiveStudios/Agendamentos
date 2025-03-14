import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Sistema avançado de agendamento com sincronização em tempo real',
  },
  {
    icon: Clock,
    title: 'Otimização de Tempo',
    description: 'Reduza no-shows e maximize sua produtividade',
  },
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Base de dados completa com histórico e preferências',
  },
];

const plans = [
  {
    name: 'Silver',
    price: 'R$ 89',
    period: '/mês',
    features: [
      'Até 100 agendamentos/mês',
      'Página de agendamento personalizada',
      'Notificações por email',
      'Relatórios básicos',
    ],
    popular: false,
  },
  {
    name: 'Gold',
    price: 'R$ 149',
    period: '/mês',
    features: [
      'Até 300 agendamentos/mês',
      'Página personalizada com seu logo',
      'Notificações por email e SMS',
      'Relatórios avançados',
      'Integração com Google Calendar',
    ],
    popular: true,
  },
  {
    name: 'Platinum',
    price: 'R$ 249',
    period: '/mês',
    features: [
      'Agendamentos ilimitados',
      'Página totalmente customizável',
      'Sistema completo de notificações',
      'Analytics avançado',
      'Integrações premium',
      'Suporte prioritário',
    ],
    popular: false,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pt-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
              >
                Transforme seu Negócio com Agendamentos Inteligentes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600"
              >
                Simplifique sua agenda, aumente suas vendas e encante seus clientes com nossa plataforma completa de agendamentos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex items-center justify-center gap-x-6"
              >
                <button
                  onClick={() => navigate('/cadastro')}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-indigo-600 px-8 py-3 text-white transition hover:bg-indigo-700"
                >
                  <span className="relative flex items-center gap-2">
                    Começar Agora
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-6 inline-block rounded-lg bg-indigo-600 p-3 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mx-auto mt-32 max-w-7xl px-6 pb-32 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Escolha o Plano Ideal para Seu Negócio
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Preços transparentes, sem surpresas. Cancele quando quiser.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative rounded-2xl border ${
                  plan.popular ? 'border-indigo-600' : 'border-gray-200'
                } bg-white p-8 shadow-sm transition-all hover:shadow-lg`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Mais Popular
                  </span>
                )}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-sm font-semibold text-gray-600">{plan.period}</span>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/cadastro')}
                  className={`w-full rounded-lg ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  } px-4 py-2 font-semibold transition-colors`}
                >
                  Começar Agora
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AnimatePresence>
  );
}