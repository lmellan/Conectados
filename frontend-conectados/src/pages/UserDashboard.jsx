"use client";

import { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { bookings, services } from "../data/mockData";
import ConfirmationModal from "../components/ConfirmationModal";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [userBookings, setUserBookings] = useState({
    upcoming: [],
    completed: [],
    canceled: [],
  });

  // Estados para modales y edición
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Cargar reservas del usuario
  const loadUserBookings = () => {
    if (user) {
      // Filtrar reservas del usuario actual
      const userFilteredBookings = bookings.filter(
        (booking) => booking.userId === user.id
      );

      // Separar en próximas, completadas y canceladas
      const upcoming = userFilteredBookings.filter(
        (booking) => booking.status === "upcoming"
      );
      const completed = userFilteredBookings.filter(
        (booking) => booking.status === "completed"
      );
      const canceled = userFilteredBookings.filter(
        (booking) => booking.status === "canceled"
      );

      // Agregar información del servicio a cada reserva
      const upcomingWithDetails = upcoming.map((booking) => {
        const serviceDetails = services.find(
          (service) => service.id === booking.serviceId
        );
        return { ...booking, serviceDetails };
      });

      const completedWithDetails = completed.map((booking) => {
        const serviceDetails = services.find(
          (service) => service.id === booking.serviceId
        );
        return { ...booking, serviceDetails };
      });

      const canceledWithDetails = canceled.map((booking) => {
        const serviceDetails = services.find(
          (service) => service.id === booking.serviceId
        );
        return { ...booking, serviceDetails };
      });

      setUserBookings({
        upcoming: upcomingWithDetails,
        completed: completedWithDetails,
        canceled: canceledWithDetails,
      });
    }
  };

  useEffect(() => {
    loadUserBookings();
  }, [user]);

  // Funciones para cancelar reserva
  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      // Encontrar la reserva en el array original y cambiar su estado
      const bookingIndex = bookings.findIndex(
        (b) => b.id === selectedBooking.id
      );
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = "canceled";

        // Actualizar el estado local
        loadUserBookings();
        setShowCancelModal(false);
        setSelectedBooking(null);
      }
    }
  };

  // Funciones para editar reserva
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      date: booking.date,
      time: booking.time,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editForm.date) {
      errors.date = "La fecha es obligatoria";
    }

    if (!editForm.time) {
      errors.time = "La hora es obligatoria";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const confirmEditBooking = () => {
    if (!validateEditForm()) return;

    if (selectedBooking) {
      // Encontrar la reserva en el array original y actualizar fecha y hora
      const bookingIndex = bookings.findIndex(
        (b) => b.id === selectedBooking.id
      );
      if (bookingIndex !== -1) {
        bookings[bookingIndex].date = editForm.date;
        bookings[bookingIndex].time = editForm.time;

        // Actualizar el estado local
        loadUserBookings();
        setShowEditModal(false);
        setSelectedBooking(null);
      }
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
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
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
                  onClick={() => setActiveTab("upcoming")}
                  className={`pb-4 px-1 ${
                    activeTab === "upcoming"
                      ? "border-b-2 border-green-500 text-green-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Próximas Citas
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`pb-4 px-1 ${
                    activeTab === "completed"
                      ? "border-b-2 border-green-500 text-green-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Historial
                </button>
                <button
                  onClick={() => setActiveTab("canceled")}
                  className={`pb-4 px-1 ${
                    activeTab === "canceled"
                      ? "border-b-2 border-green-500 text-green-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Canceladas
                </button>
              </nav>
            </div>

            {activeTab === "upcoming" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Próximas Citas</h2>

                {userBookings.upcoming.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.upcoming.map((booking) => (
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
                              {booking.serviceDetails?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Proveedor: {booking.serviceDetails?.providerName}
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
                                {booking.date}
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
                                {booking.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="btn-secondary text-sm"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            Cancelar
                          </button>
                          <button
                            className="btn-primary text-sm"
                            onClick={() => handleEditBooking(booking)}
                          >
                            Reagendar
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

            {activeTab === "completed" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Historial de Servicios
                </h2>

                {userBookings.completed.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.completed.map((booking) => (
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
                              {booking.serviceDetails?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Proveedor: {booking.serviceDetails?.providerName}
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
                                {booking.date}
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
                            <span className="text-sm text-gray-500">
                              Reseña enviada
                            </span>
                          ) : (
                            <button className="btn-primary text-sm">
                              Dejar Reseña
                            </button>
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

            {activeTab === "canceled" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Servicios Cancelados
                </h2>

                {userBookings.canceled.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.canceled.map((booking) => (
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
                              {booking.serviceDetails?.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Proveedor: {booking.serviceDetails?.providerName}
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
                                {booking.date}
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span className="text-sm text-red-600 font-medium">
                                Cancelado
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Link
                            to={`/service/${booking.serviceId}`}
                            className="text-green-600 text-sm hover:underline"
                          >
                            Reservar de nuevo
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No tienes servicios cancelados.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para cancelar reserva */}
      {showCancelModal && (
        <ConfirmationModal
          title="Cancelar reserva"
          message="¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
          confirmText="Sí, cancelar"
          cancelText="No, mantener"
          onConfirm={confirmCancelBooking}
          onCancel={() => setShowCancelModal(false)}
          isDestructive={true}
        />
      )}

      {/* Modal para editar reserva */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Reagendar cita</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="edit-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nueva fecha
                  </label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditFormChange}
                    className={`input-field ${
                      formErrors.date ? "border-red-500" : ""
                    }`}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nueva hora
                  </label>
                  <select
                    id="edit-time"
                    name="time"
                    value={editForm.time}
                    onChange={handleEditFormChange}
                    className={`input-field ${
                      formErrors.time ? "border-red-500" : ""
                    }`}
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
                  {formErrors.time && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmEditBooking}
                  className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
