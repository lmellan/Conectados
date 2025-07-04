import { Link } from "react-router-dom";
import StarRatingDisplay from "./StarRatingDisplay"; // Importamos el nuevo componente

// Este componente está diseñado para mostrar servicios usando la estructura de mockData.js
const FeaturedServiceCard = ({ service }) => {
  return (
    <div className="card">
      <img
        // Usamos 'image' de mockData en lugar de 'foto'
        src={service.image ? service.image : "/placeholder.svg"}
        // Usamos 'title' de mockData en lugar de 'nombre'
        alt={service.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          {/* Usamos 'title' de mockData en lugar de 'nombre' */}
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {/* Usamos 'category' de mockData en lugar de 'categoria' */}
            {service.category}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <img
            // Usamos 'providerImage' de mockData en lugar de 'prestador?.imagen'
            src={
              service.providerImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                service.providerName
              )}&background=0D8ABC&color=fff`
            }
            // Usamos 'providerName' de mockData en lugar de 'prestador?.nombre'
            alt={service.providerName}
            className="w-8 h-8 rounded-full mr-2"
          />
          {/* Usamos 'providerName' de mockData en lugar de 'prestador?.nombre' */}
          <span className="text-sm text-gray-600">{service.providerName}</span>
        </div>
        {/* Aquí agregamos la visualización de las estrellas */}
        {/* Asumimos que mockData.js tiene una propiedad 'rating' o 'averageRating' para el servicio. */}
        {/* Multiplicamos por 2 si el rating del mock es de 1-5 para ajustarlo a la escala 1-10 del StarRatingDisplay. */}
        <div className="flex items-center mb-3">
          <StarRatingDisplay
            rating={(service.rating || service.averageRating || 0) * 2}
          />
          {/* Opcional: Mostrar el número de reseñas si el mockData lo proporciona */}
          {service.reviewsCount && (
            <span className="text-sm text-gray-600 ml-2">
              ({service.reviewsCount} reseñas)
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600">
            ${service.price}/hora
          </span>
          <Link to={`/service/${service.id}`} className="btn-secondary text-sm">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedServiceCard;
