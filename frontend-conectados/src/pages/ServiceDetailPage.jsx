"use client";

import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import { services, users } from "../data/mockData";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const foundService = services.find((s) => s.id === Number.parseInt(id));

      if (foundService) {
        setService(foundService);

        // Buscar el proveedor del servicio
        const foundProvider = users.find(
          (u) => u.id === foundService.providerId
        );
        setProvider(foundProvider);
      }

      setLoading(false);
    }, 500);
  }, [id]);

  const handleBookService = () => {
    if (!user) {
      // Redirigir a login si no hay usuario autenticado
      navigate("/login");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Por favor selecciona una fecha y hora para tu cita");
      return;
    }

    // Simular reserva exitosa
    alert(
      `Servicio reservado con éxito para el ${selectedDate} a las ${selectedTime}`
    );
    navigate("/user-dashboard");
  };

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
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                  <div className="ml-4 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(service.rating)
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
                      {service.rating} ({service.reviews} reseñas)
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {service.title}
                </h1>

                <div className="flex items-center mb-6">
                  <img
                    src={service.providerImage || "/placeholder.svg"}
                    alt={service.providerName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{service.providerName}</p>
                    <p className="text-sm text-gray-600">
                      {provider?.profession}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              </div>

              <div className="w-full md:w-80 bg-gray-50 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${service.price}
                  </span>
                  <span className="text-gray-600">/hora</span>
                </div>

                {provider && (
                  <AvailabilityCalendar
                    availability={provider.availability || [0, 1, 2, 3, 4]}
                  />
                )}

                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="date"
                      className="input-field"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hora
                    </label>
                    <select
                      id="time"
                      className="input-field"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Seleccionar hora</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>

                  <button
                    onClick={handleBookService}
                    className="w-full btn-primary py-3"
                  >
                    Solicitar Servicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
