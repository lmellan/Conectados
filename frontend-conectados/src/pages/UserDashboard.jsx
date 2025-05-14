"use client";

import { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { bookings, services } from "../data/mockData";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Pendiente");
  const [userBookings, setUserBookings] = useState({
    Pendiente: [],
    Completada: [],
  });
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/citas/buscador/${user.id}`);
        if (!response.ok) throw new Error("Error al obtener citas");
  
        const citas = await response.json();
  
        const citasConDetalles = await Promise.all(
          citas.map(async (cita) => {
            const resServicio = await fetch(`http://localhost:8080/api/servicios/${cita.idServicio}`);
            const servicio = await resServicio.json();
        
            // Verificar si el usuario ya dejó una reseña
            const yaReseno = servicio.resenas?.some(resena => resena.buscador?.id === user.id);
        
            return {
              ...cita,
              serviceDetails: {
                title: servicio.nombre,
                prestador: servicio.prestador,
                image: servicio.foto || "/placeholder.svg",
              },
              reviewed: yaReseno,
            };
          })
        );
        
  
        const upcoming = citasConDetalles.filter(cita => cita.estado === "Pendiente");
        const completed = citasConDetalles.filter(cita => cita.estado === "Completada");
        
        setUserBookings({ Pendiente: upcoming, Completada: completed });

      } catch (error) {
        console.error("Error al cargar citas:", error);
      }
    };
  
    if (user && user.rol === "BUSCADOR") {
      fetchBookings();
    }
  }, [user]);
 
  const handleCancelarCita = async (idCita) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmacion) return;
  
    try {
      const response = await fetch(`http://localhost:8080/api/citas/eliminar/${idCita}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Error al cancelar la cita");
  
      // Quitar la cita del estado actual sin recargar todo
      setUserBookings(prev => ({
        ...prev,
        Pendiente: prev.Pendiente.filter(cita => cita.id !== idCita),
      }));
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      alert("No se pudo cancelar la cita. Intenta nuevamente.");
    }
  };
  

  // Redirigir si no hay usuario autenticado o es un profesional
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.isProfessional) {
    return <Navigate to="/pro-dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">

            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={user.imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=0D8ABC&color=fff`}
                alt={user.nombre}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold">{user.nombre}</h1>
                <p className="text-gray-600">{user.correo}</p>
              </div>
            </div>

              <Link to="/search" className="btn-primary">
                Buscar Servicios
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="border-b mb-6">
              <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("Pendiente")}
                className={`pb-4 px-1 ${
                  activeTab === "Pendiente"
                    ? "border-b-2 border-green-500 text-green-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Próximas Citas
              </button>
              <button
                onClick={() => setActiveTab("Completada")}
                className={`pb-4 px-1 ${
                  activeTab === "Completada"
                    ? "border-b-2 border-green-500 text-green-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Historial
              </button>

              </nav>
            </div>

            {activeTab === "Pendiente" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Próximas Citas</h2>

                {userBookings.Pendiente.length > 0 ? (

                  <div className="space-y-4">
                    {userBookings.Pendiente.map((booking) => (
                      <div
                        key={booking.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start mb-4 md:mb-0">
                          <img
                            src={
                              booking.serviceDetails.image || "/placeholder.svg"
                            }
                            alt={booking.serviceDetails?.title|| "Servicio"}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {booking.serviceDetails?.title || "Servicio"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Proveedor: {booking.serviceDetails?.prestador?.nombre || "Prestador desconocido"}

                            </p>
                            <div className="flex items-center mt-1">
                              <svg
                                className="w-4 h-4 text-gray-500 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                                {booking.fecha}
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
                              <svg
                                className="w-4 h-4 text-gray-500 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                              {booking.hora}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                        <button
                            onClick={() => handleCancelarCita(booking.id)}
                            className="btn-secondary text-sm"
                          >
                            Cancelar
                          </button>
                          <button className="btn-primary text-sm">
                            Contactar
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No tienes citas programadas.
                    </p>
                    <Link
                      to="/search"
                      className="text-green-600 font-medium hover:underline mt-2 inline-block"
                    >
                      Buscar servicios
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Completada" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Historial de Servicios
                </h2>

                {userBookings.Completada.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.Completada.map((booking) => (
                      <div
                        key={booking.id}
                        className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start mb-4 md:mb-0">
                          <img
                            src={
                              booking.serviceDetails.image || "/placeholder.svg"
                            }
                            alt={booking.serviceDetails?.title || "Servicio"}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {booking.serviceDetails?.title || "Servicio"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Proveedor: {booking.serviceDetails?.prestador?.nombre || "Prestador desconocido"}
                            </p>
                            <div className="flex items-center mt-1">
                              <svg
                                className="w-4 h-4 text-gray-500 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                                {booking.fecha}
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span className="text-sm text-green-600 font-medium">
                                Completado
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                        {booking.reviewed ? (
                          <Link to={`/service/${booking.idServicio}`} className="btn-secondary text-sm">Ver Servicio</Link>
                        ) : (
                          <Link to={`/crear-resena/${booking.id}`} className="btn-primary text-sm">Dejar Reseña</Link>
                        )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No tienes servicios completados.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;