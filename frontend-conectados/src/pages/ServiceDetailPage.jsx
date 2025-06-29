"use client";

import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import ConfirmationModal from "../components/ConfirmationModal";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/servicios/${id}`);
        if (!response.ok) throw new Error("Error al obtener el servicio");

        const servicioData = await response.json();
        setService(servicioData);
        setProvider(servicioData.prestador);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDate) newErrors.date = "Por favor selecciona una fecha";
    if (!selectedTime) newErrors.time = "Por favor selecciona una hora";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookService = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!validateForm()) return;

    const nuevaCita = {
      idBuscador: user.id,
      idPrestador: provider.id,
      idServicio: service.id,
      fecha: selectedDate,
      hora: selectedTime,
      estado: "Pendiente"
    };

    try {
      const response = await fetch("http://localhost:8080/api/citas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCita)
      });

      if (!response.ok) throw new Error("No se pudo agendar la cita");

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear cita:", error);
      alert("Hubo un error al agendar la cita. Inténtalo nuevamente.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/user-dashboard");
  };

  const diasSemana = {
    "Lunes": 0,
    "Martes": 1,
    "Miércoles": 2,
    "Jueves": 3,
    "Viernes": 4,
    "Sábado": 5,
    "Domingo": 6,
  };

  const disponibilidadNumerica = provider?.disponibilidad?.map(dia => diasSemana[dia]) || [];

  // Si el usuario es un prestador, ocultamos la opción de agendar cita
  const isBuscador = user?.rolActivo === "BUSCADOR";

  // Formatear las horas de inicio y fin para mostrarlas correctamente
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(":");
    const formattedHours = hours % 12 || 12; // Formato 12 horas
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Obtener las horas disponibles entre horaInicio y horaFin
  const getAvailableTimes = () => {
    if (!provider) return [];

    const start = parseInt(provider.horaInicio.split(":")[0], 10); // Hora de inicio
    const end = parseInt(provider.horaFin.split(":")[0], 10); // Hora de fin
    const availableTimes = [];

    for (let i = start; i < end; i++) {
      availableTimes.push(`${i}:00`);
      availableTimes.push(`${i}:30`); // También se puede agregar media hora
    }

    return availableTimes;
  };

  const availableTimes = getAvailableTimes();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Cargando detalles del servicio...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl text-gray-700 mb-4">Servicio no encontrado</p>
        <button onClick={() => navigate("/search")} className="btn-primary">
          Volver a la búsqueda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={service.foto ? service.foto : "/placeholder.svg"}
              alt={service.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            {/* Datos generales */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {service.categoria}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">{service.nombre}</h1>

                <div className="flex items-center mb-6">
                  <img
                    src={provider?.imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider?.nombre)}&background=0D8ABC&color=fff`}
                    alt={provider?.nombre}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{provider?.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {provider?.categoria?.join(", ")}
                    </p>
                    {/* Mostrar horas de disponibilidad */}
                    <p className="text-sm text-gray-600">
                      Horario disponible: {formatTime(provider?.horaInicio)} - {formatTime(provider?.horaFin)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                  <p className="text-gray-700">{service.descripcion}</p>
                </div>
              </div>

              {/* Calendario + Reserva */}
              <div className="w-full md:w-80 bg-gray-50 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${service.precio}
                  </span>
                  <span className="text-gray-600">/hora</span>
                </div>

                {provider && (
                  <AvailabilityCalendar availability={disponibilidadNumerica} />
                )}
                {isBuscador && ( // Solo mostrar la opción si el usuario es un buscador
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha
                      </label>
                      <input
                        type="date"
                        id="date"
                        className={`input-field ${errors.date ? "border-red-500" : ""}`}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora
                      </label>
                      <select
                        id="time"
                        className={`input-field ${errors.time ? "border-red-500" : ""}`}
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Seleccionar hora</option>
                        {availableTimes.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      {errors.time && <p className="text-sm text-red-600 mt-1">{errors.time}</p>}
                    </div>

                    <button onClick={handleBookService} className="w-full btn-primary py-3">
                      Solicitar Servicio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal de login */}
            {showLoginModal && (
              <ConfirmationModal
                title="Iniciar sesión requerido"
                message="Debes iniciar sesión para solicitar este servicio."
                confirmText="Ir a iniciar sesión"
                cancelText="Cancelar"
                onConfirm={() => navigate("/login")}
                onCancel={() => setShowLoginModal(false)}
              />
            )}

            {/* Modal de éxito */}
            {showSuccessModal && (
              <ConfirmationModal
                title="¡Servicio agendado!"
                message={`Has agendado el servicio "${service.nombre}" para el ${selectedDate} a las ${selectedTime}.`}
                confirmText="Ver mis reservas"
                showCancel={false}
                onConfirm={handleCloseSuccessModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
