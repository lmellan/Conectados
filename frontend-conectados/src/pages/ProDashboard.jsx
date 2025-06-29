// frontend-conectados/src/pages/ProDashboard.jsx
"use client";

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ConfirmationModal from "../components/ConfirmationModal";
import RescheduleAppointmentModal from "../components/RescheduleAppointmentModal"; // Importar el nuevo modal
import axios from "axios";

const ProDashboard = () => {
  const { user, token } = useContext(AuthContext); // Usamos useContext directamente
  const [activeTab, setActiveTab] = useState("services");
  const [proServices, setProServices] = useState([]);
  const [proBookings, setProBookings] = useState({
    upcoming: [],
    completed: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  // Nuevos estados para el modal de reprogramación
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBookingToReschedule, setSelectedBookingToReschedule] =
    useState(null);

  const loadProData = async () => {
    if (user && token && user.rolActivo === "PRESTADOR") {
      try {
        const [serviciosResponse, citasResponse] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/servicios/prestador/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`http://localhost:8080/api/citas/prestador/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProServices(serviciosResponse.data);
        const citas = citasResponse.data;

        const citasConDetalles = await Promise.all(
          citas.map(async (cita) => {
            const [resServicio, resCliente] = await Promise.all([
              axios.get(
                `http://localhost:8080/api/servicios/${cita.idServicio}`,
                { headers: { Authorization: `Bearer ${token}` } }
              ),
              axios.get(
                `http://localhost:8080/api/usuarios/id/${cita.idBuscador}`,
                { headers: { Authorization: `Bearer ${token}` } }
              ),
            ]);
            return {
              ...cita,
              serviceDetails: {
                title: resServicio.data.nombre,
                image: resServicio.data.foto || "/placeholder.svg",
              },
              cliente: resCliente.data,
            };
          })
        );

        const pendientes = citasConDetalles.filter(
          (c) => c.estado === "Pendiente"
        );
        const completadas = citasConDetalles.filter(
          (c) => c.estado === "Completada"
        );

        setProBookings({ upcoming: pendientes, completed: completadas });
      } catch (error) {
        console.error("Error al cargar datos del prestador:", error);
      }
    }
  };

  useEffect(() => {
    loadProData();
  }, [user, token]); // Añadido token a las dependencias

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      try {
        await axios.delete(
          `http://localhost:8080/api/servicios/eliminar/${serviceToDelete.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServiceToDelete(null);
        setShowDeleteModal(false);
        loadProData(); // Recargar datos después de eliminar
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
      }
    }
  };

  // Función para manejar la apertura del modal de reprogramación
  const handleRescheduleClick = (booking) => {
    setSelectedBookingToReschedule(booking);
    setShowRescheduleModal(true);
  };

  // Función para manejar el éxito de la reprogramación
  const handleRescheduleSuccess = () => {
    setShowRescheduleModal(false);
    setSelectedBookingToReschedule(null);
    loadProData(); // Recargar datos después de reprogramar
  };

  if (!user || user.rolActivo !== "PRESTADOR") {
    // Si no es un prestador logueado, puedes redirigir o mostrar un mensaje
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">
          Acceso denegado. Debes ser un prestador para ver este panel.
        </p>
      </div>
    );
  }

  return (
    <>
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
                      )}&background=2A4B7C&color=fff`
                    }
                    alt={user.nombre}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">{user.nombre}</h1>
                    <p className="text-gray-600">{user.correo}</p>
                    <p className="text-gray-600 capitalize">
                      {Array.isArray(user.categoria)
                        ? user.categoria.join(", ")
                        : user.categoria || "Sin categoría"}
                    </p>
                  </div>
                </div>
                <Link to="/create-service" className="btn-primary">
                  Añadir Nuevo Servicio
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="border-b mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("services")}
                    className={`pb-4 px-1 ${
                      activeTab === "services"
                        ? "border-b-2 border-green-500 text-green-600 font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Mis Servicios
                  </button>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`pb-4 px-1 ${
                      activeTab === "bookings"
                        ? "border-b-2 border-green-500 text-green-600 font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Citas Programadas
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-4 px-1 ${
                      activeTab === "history"
                        ? "border-b-2 border-green-500 text-green-600 font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Historial
                  </button>
                </nav>
              </div>

              {activeTab === "services" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Mis Servicios</h2>
                  {proServices.length > 0 ? (
                    <div className="space-y-4">
                      {proServices.map((service) => (
                        <div
                          key={service.id}
                          className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex items-start mb-4 md:mb-0">
                            <img
                              src={service.foto || "/placeholder.svg"}
                              alt={service.nombre}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {service.nombre}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Categoría: {service.categoria}
                              </p>
                              <p className="text-sm font-medium text-green-600">
                                ${service.precio}/hora
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteService(service)}
                              className="px-3 py-1 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50"
                            >
                              Eliminar
                            </button>
                            <Link
                              to={`/edit-service/${service.id}`}
                              className="btn-secondary text-sm"
                            >
                              Editar
                            </Link>
                            <Link
                              to={`/service/${service.id}`}
                              className="btn-primary text-sm"
                            >
                              Ver
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        No tienes servicios publicados.
                      </p>
                      <Link
                        to="/create-service"
                        className="text-green-600 font-medium hover:underline mt-2 inline-block"
                      >
                        Añadir un servicio
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Citas Programadas
                  </h2>
                  {proBookings.upcoming.length > 0 ? (
                    <div className="space-y-4">
                      {proBookings.upcoming.map((booking) => (
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
                              alt={booking.serviceDetails?.title}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {booking.serviceDetails.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <img
                                  src={
                                    booking.cliente?.imagen ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      booking.cliente?.nombre || "Cliente"
                                    )}&background=0D8ABC&color=fff`
                                  }
                                  alt={booking.cliente?.nombre || "Cliente"}
                                  className="w-8 h-8 rounded-full"
                                />
                                <p className="text-sm text-gray-600">
                                  Cliente: {booking.cliente?.nombre}
                                </p>
                              </div>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-600">
                                  {booking.fecha}
                                </span>
                                <span className="mx-2 text-gray-400">|</span>
                                <span className="text-sm text-green-600 font-medium">
                                  {booking.hora}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {/* Botón Reprogramar: Ahora funcional */}
                            <button
                              onClick={() => handleRescheduleClick(booking)}
                              className="btn-secondary text-sm"
                            >
                              Reprogramar
                            </button>
                            <button
                              onClick={() => {
                                if (booking.cliente?.numero) {
                                  const numero = booking.cliente.numero.replace(
                                    "+",
                                    ""
                                  );
                                  const mensaje = `Hola ${booking.cliente.nombre}, soy ${user.nombre} de Conectados. Confirmo tu cita para el ${booking.fecha} a las ${booking.hora}.`;
                                  window.open(
                                    `https://wa.me/${numero}?text=${encodeURIComponent(
                                      mensaje
                                    )}`,
                                    "_blank"
                                  );
                                } else {
                                  alert(
                                    "Este usuario no tiene un número registrado."
                                  );
                                }
                              }}
                              className="btn-primary text-sm"
                            >
                              Contactar por WhatsApp
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No tienes citas programadas.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Historial de Servicios
                  </h2>
                  {proBookings.completed.length > 0 ? (
                    <div className="space-y-4">
                      {proBookings.completed.map((booking) => (
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
                              alt={booking.serviceDetails?.title}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <h3 className="font-semibold">
                                {booking.serviceDetails.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Cliente: {booking.cliente?.nombre}
                              </p>
                              <div className="flex items-center mt-1">
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

      {showDeleteModal && (
        <ConfirmationModal
          title="Eliminar servicio"
          message={`¿Estás seguro de que deseas eliminar el servicio "${serviceToDelete?.nombre}"?`}
          confirmText="Sí, eliminar"
          cancelText="No, cancelar"
          onConfirm={confirmDeleteService}
          onCancel={() => setShowDeleteModal(false)}
          isDestructive={true}
        />
      )}

      {/* Nuevo Modal de Reprogramación */}
      {showRescheduleModal && selectedBookingToReschedule && (
        <RescheduleAppointmentModal
          booking={selectedBookingToReschedule}
          providerAvailability={{
            disponibilidad: user.disponibilidad, // Acceder a la disponibilidad del usuario logueado
            horaInicio: user.horaInicio,
            horaFin: user.horaFin,
          }}
          onClose={() => setShowRescheduleModal(false)}
          onRescheduleSuccess={handleRescheduleSuccess}
          token={token}
        />
      )}
    </>
  );
};

export default ProDashboard;
