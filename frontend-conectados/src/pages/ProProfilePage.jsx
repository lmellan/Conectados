"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import ServiceCard from "../components/ServiceCard";
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
                  src={professional.image || "/placeholder.svg"}
                  alt={professional.name}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h1 className="text-2xl font-bold text-center">
                  {professional.name}
                </h1>
                <p className="text-gray-600 text-center">
                  {professional.profession}
                </p>

                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">
                    4.0 (15 reseñas)
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
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < testimonial.rating
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
