"use client";

import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import { bookings } from "../data/mockData";
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

  const handleBookService = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!validateForm()) return;

    const newBooking = {
      id: bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1,
      serviceId: service.id,
      userId: user.id,
      providerId: provider?.nombre,
      date: selectedDate,
      time: selectedTime,
      status: "upcoming",
      reviewed: false,
    };

    bookings.push(newBooking);
    setShowSuccessModal(true);
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
              src={service.fotos?.[0] || "/placeholder.svg"}
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
                  <div className="ml-4 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(service.valoracionPromedio || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">
                      {service.valoracionPromedio?.toFixed(1) || "0.0"} ★
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">{service.nombre}</h1>

                <div className="flex items-center mb-6">
                  <img
                    src={"https://randomuser.me/api/portraits/women/5.jpg"}
                    alt={provider?.nombre}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{provider?.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {provider?.categoria?.join(", ")}
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

                {user?.rol !== "PRESTADOR" && (
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
                        {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(h => (
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

            {/* Reseñas */}
            <div className="mt-6 w-full">
              <h2 className="text-lg font-semibold mb-4">Reseñas</h2>
              {service.resenas?.length > 0 ? (
                <div className="grid gap-4">
                  {service.resenas.map((r) => (
                    <div key={r.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-800">{r.nombreBuscador}</p>
                        <p className="text-sm text-yellow-600 font-semibold">{r.valoracion}/10</p>
                      </div>
                      <p className="italic text-gray-700 mb-1">"{r.comentario}"</p>
                      <p className="text-xs text-gray-400">{r.fecha}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Este servicio aún no tiene reseñas.</p>
              )}
            </div>
          </div>
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
  );
};

export default ServiceDetailPage;
