import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import ServiceCard from "../components/ServiceCard";
import TestimonialCard from "../components/TestimonialCard";
import { services, testimonials } from "../data/mockData";

const HomePage = () => {
  // Mostrar solo los 3 servicios mejor valorados
  const topServices = [...services]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Conectados – Servicios a un Clic
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos a usuarios con los mejores profesionales para servicios a
            domicilio. Encuentra ayuda rápida y confiable para cualquier
            necesidad.
          </p>
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>
          <Link to="/register" className="btn-primary mr-4">
            Buscar Servicios
          </Link>
          {/* MODIFICADO: Este enlace ahora apunta a /register */}
          <Link to="/register" className="btn-secondary">
            Ofrecer mis Servicios
          </Link>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Explora por Categoría
          </h2>
          <CategoryList />
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Servicios Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/search" className="btn-primary">
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Eres un profesional?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y comienza a ofrecer tus servicios a
            miles de usuarios.
          </p>
          {/* MODIFICADO: Este enlace también apunta a /register */}
          <Link
            to="/register"
            className="bg-white text-green-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
          >
            Registrarme como profesional
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
