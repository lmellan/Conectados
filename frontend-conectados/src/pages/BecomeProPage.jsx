import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BecomeProPage = () => {
  const [formData, setFormData] = useState({
    categoria: [],
    descripcion: "",
    zonaAtencion: "",
    disponibilidad: [],
    horaInicio: "09:00",
    horaFin: "18:00",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtenemos el objeto 'user' completo para usar su correo
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const daysOfWeek = [
    { id: 0, name: "Lunes" },
    { id: 1, name: "Martes" },
    { id: 2, name: "Miércoles" },
    { id: 3, name: "Jueves" },
    { id: 4, name: "Viernes" },
    { id: 5, name: "Sábado" },
    { id: 6, name: "Domingo" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityChange = (dayName) => {
    const updatedAvailability = formData.disponibilidad.includes(dayName)
      ? formData.disponibilidad.filter((d) => d !== dayName)
      : [...formData.disponibilidad, dayName];
    setFormData({ ...formData, disponibilidad: updatedAvailability });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user || !user.correo) {
      setError(
        "No se pudo identificar al usuario. Por favor, inicia sesión de nuevo."
      );
      setLoading(false);
      return;
    }

    if (
      formData.categoria.length === 0 ||
      formData.disponibilidad.length === 0
    ) {
      setError(
        "Debes seleccionar al menos una categoría y un día de disponibilidad."
      );
      setLoading(false);
      return;
    }

    try {
      // --- MODIFICACIÓN CLAVE Y FINAL ---
      // La URL ahora es dinámica e incluye el correo del usuario logueado.
      const response = await axios.put(
        `http://localhost:8080/api/usuarios/${user.correo}/add-professional-details`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login(response.data, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al actualizar perfil a profesional:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Ocurrió un error. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // El JSX del formulario no cambia
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Completa tu Perfil Profesional
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Añade tus detalles para empezar a ofrecer servicios en Conectados.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Categorías */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categorías de servicio
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  "Electricista",
                  "Plomero",
                  "Limpieza",
                  "Peluquero",
                  "Jardinero",
                  "Carpintero",
                ].map((cat) => (
                  <label key={cat} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={formData.categoria.includes(cat)}
                      onChange={(e) => {
                        const selected = formData.categoria.includes(
                          e.target.value
                        )
                          ? formData.categoria.filter(
                              (c) => c !== e.target.value
                            )
                          : [...formData.categoria, e.target.value];
                        setFormData({ ...formData, categoria: selected });
                      }}
                      className="mr-2"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            {/* Zona de atención, Descripción, Disponibilidad, Horarios, etc. */}
            <div>
              <label
                htmlFor="zonaAtencion"
                className="block text-sm font-medium text-gray-700"
              >
                Zona de atención
              </label>
              <select
                id="zonaAtencion"
                name="zonaAtencion"
                required
                value={formData.zonaAtencion}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Selecciona una región</option>
                <option value="Arica y Parinacota">Arica y Parinacota</option>
                <option value="Tarapacá">Tarapacá</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Atacama">Atacama</option>
                <option value="Coquimbo">Coquimbo</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Región Metropolitana">
                  Región Metropolitana
                </option>
                <option value="O’Higgins">O’Higgins</option>
                <option value="Maule">Maule</option>
                <option value="Ñuble">Ñuble</option>
                <option value="Biobío">Biobío</option>
                <option value="La Araucanía">La Araucanía</option>
                <option value="Los Ríos">Los Ríos</option>
                <option value="Los Lagos">Los Lagos</option>
                <option value="Aysén">Aysén</option>
                <option value="Magallanes">Magallanes</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción de tus servicios
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={3}
                required
                value={formData.descripcion}
                onChange={handleChange}
                className="input-field"
                placeholder="Describe tu experiencia..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidad Semanal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center">
                    <input
                      id={`day-${day.name}`}
                      type="checkbox"
                      checked={formData.disponibilidad.includes(day.name)}
                      onChange={() => handleAvailabilityChange(day.name)}
                      className="h-4 w-4 text-green-600"
                    />
                    <label
                      htmlFor={`day-${day.name}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {day.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="horaInicio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  id="horaInicio"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="horaFin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hora de Fin
                </label>
                <input
                  type="time"
                  id="horaFin"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {loading
                  ? "Guardando..."
                  : "Completar Perfil y Ofrecer Servicios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeProPage;
