"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import ServiceCard from "../components/ServiceCard";
import StarRatingDisplay from "../components/StarRatingDisplay"; // Importamos el nuevo componente
import { users, services, testimonials } from "../data/mockData";

const ProProfilePage = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [proServices, setProServices] = useState([]);
  const [proTestimonials, setProTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const foundPro = users.find(
        (u) => u.id === Number.parseInt(id) && u.isProfessional
      );

      if (foundPro) {
        setProfessional(foundPro);

        // Filtrar servicios del profesional
        const filteredServices = services.filter(
          (service) => service.providerId === foundPro.id
        );
        setProServices(filteredServices);

        // Filtrar testimonios relacionados con el profesional
        // En un caso real, esto se haría con una relación en la base de datos
        const filteredTestimonials = testimonials.filter(
          (t) =>
            t.service === foundPro.profession ||
            filteredServices.some((s) => s.title.includes(t.service))
        );
        setProTestimonials(filteredTestimonials);
      }

      setLoading(false);
    }, 500);
  }, [id]);

  // Función para calcular la valoración promedio general del profesional
  // (Opcional, como se mencionó en KAN-35. Para KAN-45, solo mostraremos estrellas.)
  const calculateOverallRating = () => {
    if (proTestimonials.length === 0) return 0; // O un valor que indique sin reseñas

    const totalRating = proTestimonials.reduce((sum, t) => sum + t.rating, 0);
    // Asumimos que los testimonios tienen un rating de 1 a 5, pero el StarRatingDisplay espera 1-10.
    // Si tus mock testimonials tienen rating 1-5, multiplica por 2.
    // Si tus mock testimonials tienen rating 1-10, úsalo directamente.
    // Aquí los mocks tienen rating 1-5, así que se ajusta.
    const averageRating = (totalRating / proTestimonials.length) * 2; // Ajuste para escala 1-10
    return averageRating;
  };

  const overallProfessionalRating = calculateOverallRating();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Cargando perfil del profesional...</p>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl text-gray-700 mb-4">Profesional no encontrado</p>
        <Link to="/search" className="btn-primary">
          Volver a la búsqueda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                <img
                  src={
                    professional.imagen ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      professional.nombre
                    )}&background=0D8ABC&color=fff`
                  }
                  alt={professional.name}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h1 className="text-2xl font-bold text-center">
                  {" "}
                  {professional.name}
                </h1>
                <p className="text-gray-600">{professional.correo}</p>
                <p className="text-gray-600 text-center">
                  {professional.profession}
                </p>

                <div className="flex items-center mt-2">
                  {/* Reemplazamos la lógica de estrellas estáticas por StarRatingDisplay */}
                  <StarRatingDisplay rating={overallProfessionalRating} />
                  <span className="ml-1 text-sm text-gray-600">
                    {/* Mostrar el número real de reseñas si lo tienes, sino mantener el mock */}
                    {overallProfessionalRating > 0
                      ? `(${proTestimonials.length} reseñas)`
                      : "(Sin reseñas)"}
                  </span>
                </div>

                <div className="mt-6 w-full">
                  <AvailabilityCalendar
                    availability={professional.availability || [0, 1, 2, 3, 4]}
                  />
                </div>

                <div className="mt-6 w-full">
                  <h3 className="font-semibold mb-2">Tarifa</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${professional.hourlyRate}/hora
                  </p>
                </div>

                <button className="btn-primary w-full mt-6">Contactar</button>
              </div>

              <div className="md:w-2/3 md:pl-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Acerca de</h2>
                  <p className="text-gray-700">
                    {professional.description ||
                      `${professional.name} es un profesional experimentado en el área de ${professional.profession}. 
                       Ofrece servicios de alta calidad y atención personalizada a todos sus clientes.`}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Servicios Ofrecidos
                  </h2>

                  {proServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {proServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Este profesional aún no ha publicado servicios.
                    </p>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Reseñas</h2>

                  {proTestimonials.length > 0 ? (
                    <div className="space-y-4">
                      {proTestimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center mb-2">
                            <img
                              src={testimonial.userImage || "/placeholder.svg"}
                              alt={testimonial.userName}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">
                                {testimonial.userName}
                              </p>
                              {/* Reemplazamos la lógica de estrellas por el nuevo componente */}
                              <StarRatingDisplay
                                rating={testimonial.rating * 2}
                              />{" "}
                              {/* Multiplicar por 2 si el mock rating es 1-5 */}
                            </div>
                          </div>
                          <p className="text-gray-700 italic">
                            "{testimonial.text}"
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Servicio: {testimonial.service}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Este profesional aún no tiene reseñas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProProfilePage;
