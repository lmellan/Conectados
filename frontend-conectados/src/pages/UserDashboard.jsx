"use client";

import { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Usamos el hook estandarizado
import axios from "axios"; // Usamos axios para consistencia

const UserDashboard = () => {
  // Obtenemos el usuario y el token desde nuestro hook
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("Pendiente");
  const [userBookings, setUserBookings] = useState({
    Pendiente: [],
    Completada: [],
  });

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id || !token) {
        return; // Salimos si no hay usuario o token
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/citas/buscador/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const citas = response.data;

        const citasConDetalles = await Promise.all(
          citas.map(async (cita) => {
            const resServicio = await axios.get(
              `http://localhost:8080/api/servicios/${cita.idServicio}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const servicio = resServicio.data;
            const yaReseno = servicio.resenas?.some(
              (resena) => resena.buscador?.id === user.id
            );

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

        const pendientes = citasConDetalles.filter(
          (cita) => cita.estado === "Pendiente"
        );
        const completadas = citasConDetalles.filter(
          (cita) => cita.estado === "Completada"
        );

        setUserBookings({ Pendiente: pendientes, Completada: completadas });
      } catch (error) {
        console.error("Error al cargar citas:", error);
      }
    };

    fetchBookings();
  }, [user, token]);

  const handleCancelarCita = async (idCita) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?"))
      return;

    try {
      await axios.delete(`http://localhost:8080/api/citas/eliminar/${idCita}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserBookings((prev) => ({
        ...prev,
        Pendiente: prev.Pendiente.filter((cita) => cita.id !== idCita),
      }));
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      alert("No se pudo cancelar la cita. Intenta nuevamente.");
    }
  };

  // --- LÓGICA DE REDIRECCIÓN OBSOLETA ELIMINADA ---
  if (!user) {
    return null; // O un componente de carga (spinner)
  }

  const esProfesional = user.roles && user.roles.includes("PRESTADOR");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={
                    user.foto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.nombre
                    )}&background=0D8ABC&color=fff`
                  }
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold">{user.nombre}</h1>
                  <p className="text-gray-600">{user.correo}</p>
                </div>
              </div>
              <Link to="/search" className="btn-primary">
                Buscar Nuevos Servicios
              </Link>
            </div>
          </div>

          {!esProfesional && (
            <div className="p-6 bg-indigo-50 border-b text-center">
              <h3 className="text-xl font-bold text-indigo-800">
                ¿Quieres ofrecer tus servicios?
              </h3>
              <p className="text-indigo-700 mt-2">
                Completa tu perfil profesional y empieza a conectar con nuevos
                clientes ahora mismo.
              </p>
              <Link
                to="/become-professional"
                className="mt-4 inline-block bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Conviértete en Profesional
              </Link>
            </div>
          )}

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
                              booking.serviceDetails?.image ||
                              "/placeholder.svg"
                            }
                            alt={booking.serviceDetails?.title || "Servicio"}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {booking.serviceDetails?.title || "Servicio"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Proveedor:{" "}
                              {booking.serviceDetails?.prestador?.nombre ||
                                "Prestador desconocido"}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600">
                                {booking.fecha}
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
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
                          <button
                            onClick={() => {
                              /* Lógica de WhatsApp */
                            }}
                            className="btn-primary text-sm"
                          >
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
                              booking.serviceDetails?.image ||
                              "/placeholder.svg"
                            }
                            alt={booking.serviceDetails?.title || "Servicio"}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {booking.serviceDetails?.title || "Servicio"}
                            </h3>
                            <p className="text-sm text-gray-600">Completado</p>
                          </div>
                        </div>
                        <div>
                          {booking.reviewed ? (
                            <span className="text-sm text-gray-500">
                              Ya has dejado una reseña
                            </span>
                          ) : (
                            <Link
                              to={`/crear-resena/${booking.id}`}
                              className="btn-primary text-sm"
                            >
                              Dejar Reseña
                            </Link>
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
