import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];
type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];

const bookingSchema = z.object({
  customerName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().min(10, 'Telefone inválido'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const steps = ['Serviço', 'Data', 'Horário', 'Seus Dados'];

export default function ClientBooking() {
  const { slug } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    async function loadBusinessAndServices() {
      try {
        // Load business profile
        const { data: businessData } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('slug', slug)
          .single();

        if (businessData) {
          setBusiness(businessData);

          // Load services
          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('business_id', businessData.id)
            .eq('active', true);

          if (servicesData) {
            setServices(servicesData);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBusinessAndServices();
  }, [slug]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      // Here you would fetch available times based on the selected date and service
      // For now, we'll use dummy data
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      setAvailableTimes(times);
    }
  }, [selectedDate, selectedService]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedService || !selectedDate || !selectedTime || !business) return;

    try {
      const startTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

      const { error } = await supabase.from('appointments').insert({
        business_id: business.id,
        service_id: selectedService.id,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: data.notes,
      });

      if (error) throw error;

      // Show success message and redirect
      alert('Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Empresa não encontrada</h1>
          <p className="mt-2 text-gray-600">Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          {business.logo_url && (
            <img
              src={business.logo_url}
              alt={business.business_name}
              className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900">{business.business_name}</h1>
          {business.description && (
            <p className="mt-2 text-gray-600">{business.description}</p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index === currentStep
                    ? 'text-indigo-600'
                    : index < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    index === currentStep
                      ? 'border-2 border-indigo-600'
                      : index < currentStep
                      ? 'bg-green-600 text-white'
                      : 'border-2 border-gray-300'
                  }`}
                >
                  {index < currentStep ? (
                    '✓'
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-lg bg-white p-6 shadow-sm"
          >
            {/* Step 1: Service Selection */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <Calendar className="mr-2 h-5 w-5" />
                  Escolha o Serviço
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        nextStep();
                      }}
                      className={`flex flex-col rounded-lg border p-4 text-left transition-colors hover:border-indigo-600 ${
                        selectedService?.id === service.id
                          ? 'border-indigo-600'
                          : 'border-gray-200'
                      }`}
                    >
                      {service.image_url && (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="mb-2 h-32 w-full rounded-md object-cover"
                        />
                      )}
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {service.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-semibold text-indigo-600">
                          R$ {service.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {service.duration} min
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <Calendar className="mr-2 h-5 w-5" />
                  Escolha a Data
                </h2>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="mx-auto"
                  modifiers={{
                    disabled: [
                      { before: new Date() },
                      { dayOfWeek: [0] }, // Disable Sundays
                    ],
                  }}
                />
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Voltar
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedDate}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próximo
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Time Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <Clock className="mr-2 h-5 w-5" />
                  Escolha o Horário
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-md border p-2 text-center transition-colors hover:border-indigo-600 ${
                        selectedTime === time
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Voltar
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedTime}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próximo
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Customer Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <User className="mr-2 h-5 w-5" />
                  Seus Dados
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      {...register('customerName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      {...register('customerEmail')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="customerPhone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      {...register('customerPhone')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Observações (opcional)
                    </label>
                    <textarea
                      id="notes"
                      {...register('notes')}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Confirmar Agendamento
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Summary */}
        {selectedService && (
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-900">Resumo</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Serviço:</span> {selectedService.name} (
                {selectedService.duration} min)
              </p>
              {selectedDate && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Data:</span>{' '}
                  {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </p>
              )}
              {selectedTime && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Horário:</span> {selectedTime}
                </p>
              )}
              <p className="text-sm font-medium text-indigo-600">
                Total: R$ {selectedService.price.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}