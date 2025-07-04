// frontend-conectados/src/components/RescheduleAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import AvailabilityCalendar from './AvailabilityCalendar'; // Asegúrate de que la ruta es correcta
import axios from 'axios'; // Usaremos axios para las peticiones API

const RescheduleAppointmentModal = ({
  booking, // La cita a reprogramar
  providerAvailability, // Propiedad que contendrá { disponibilidad: [], horaInicio: '', horaFin: '' }
  onClose, // Función para cerrar el modal
  onRescheduleSuccess, // Función a llamar si la reprogramación es exitosa
  token, // Token de autenticación
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (booking) {
      // Inicializar con la fecha y hora actuales de la reserva (opcional)
      setSelectedDate(booking.fecha);
      setSelectedTime(booking.hora);
    }
  }, [booking]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDate) newErrors.date = 'Por favor, selecciona una fecha.';
    if (!selectedTime) newErrors.time = 'Por favor, selecciona una hora.';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReschedule = async () => {
    setLoading(true);
    setApiError(null);
    setFormErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Asegurarse de que la fecha seleccionada no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear a inicio del día para comparación
    const chosenDate = new Date(selectedDate + 'T' + selectedTime); // Crear fecha-hora para comparar
    if (chosenDate < today) {
        setApiError("No puedes reprogramar una cita en el pasado.");
        setLoading(false);
        return;
    }


    const updatedCita = {
      idBuscador: booking.idBuscador,
      idPrestador: booking.idPrestador,
      idServicio: booking.idServicio,
      fecha: selectedDate,
      hora: selectedTime,
      estado: booking.estado, // Mantener el estado actual, aunque para reprogramar suelen ser 'Pendiente'
    };

    try {
      await axios.put(
        `http://localhost:8080/api/citas/editar/${booking.id}`,
        updatedCita,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRescheduleSuccess(); // Llama a la función de éxito para recargar datos
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al reprogramar cita:', error);
      // Extraer mensaje de error del backend
      setApiError(error.response?.data?.message || 'Error al reprogramar la cita. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Lógica para obtener las horas disponibles (similar a ServiceDetailPage)
  const getAvailableTimes = () => {
    if (!providerAvailability?.horaInicio || !providerAvailability?.horaFin) return [];

    const start = parseInt(providerAvailability.horaInicio.split(":")[0], 10);
    const end = parseInt(providerAvailability.horaFin.split(":")[0], 10);
    const availableTimes = [];

    for (let i = start; i < end; i++) {
        availableTimes.push(`${String(i).padStart(2, '0')}:00`);
        // Solo agrega la media hora si no es la última hora y no se pasa de la hora de fin
        if (i + 0.5 < end) {
            availableTimes.push(`${String(i).padStart(2, '0')}:30`);
        }
    }
    // Asegurarse de incluir la hora de fin si es en punto (ej. si fin es 17:00)
    if (end > start && availableTimes[availableTimes.length - 1] !== providerAvailability.horaFin) {
      if (providerAvailability.horaFin.endsWith(":00") || providerAvailability.horaFin.endsWith(":30")) {
        availableTimes.push(providerAvailability.horaFin);
      }
    }
    // Filtrar duplicados y ordenar
    return [...new Set(availableTimes)].sort();
  };

  const availableTimes = getAvailableTimes();

  // Obtener la fecha actual para el atributo 'min' del input de fecha
  const todayISO = new Date().toISOString().split("T")[0];

  if (!booking) return null; // No renderizar si no hay una reserva válida

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-2">Reprogramar Cita</h3>
          <p className="text-gray-600 mb-4">
            Servicio: <span className="font-semibold">{booking.serviceDetails?.title}</span> con <span className="font-semibold">{booking.cliente?.nombre}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Fecha actual: {booking.fecha} Hora actual: {booking.hora}
          </p>

          {/* Mostrar calendario de disponibilidad del prestador */}
          {providerAvailability && providerAvailability.disponibilidad && (
             <div className="mb-4">
               <h4 className="text-md font-semibold mb-2">Disponibilidad del Prestador:</h4>
               <AvailabilityCalendar availability={providerAvailability.disponibilidad.map(dia => ({
                 "Lunes": 0, "Martes": 1, "Miércoles": 2, "Jueves": 3, "Viernes": 4, "Sábado": 5, "Domingo": 6
               })[dia]) || []} />
               <p className="text-sm text-gray-600 mt-2">Horario: {providerAvailability.horaInicio} - {providerAvailability.horaFin}</p>
             </div>
           )}

          <div className="space-y-4">
            <div>
              <label htmlFor="reschedule-date" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Fecha
              </label>
              <input
                type="date"
                id="reschedule-date"
                className={`input-field ${formErrors.date ? 'border-red-500' : ''}`}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={todayISO} // No permitir fechas pasadas
              />
              {formErrors.date && <p className="text-sm text-red-600 mt-1">{formErrors.date}</p>}
            </div>

            <div>
              <label htmlFor="reschedule-time" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Hora
              </label>
              <select
                id="reschedule-time"
                className={`input-field ${formErrors.time ? 'border-red-500' : ''}`}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Seleccionar hora</option>
                {availableTimes.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              {formErrors.time && <p className="text-sm text-red-600 mt-1">{formErrors.time}</p>}
            </div>

            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {apiError}</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Reprogramando...' : 'Confirmar Reprogramación'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;