import { Link } from "react-router-dom";
// Importamos el nuevo componente de estrellas
import StarRatingDisplay from "./StarRatingDisplay";

const ServiceCard = ({ service }) => {
  return (
    <div className="card">
      <img
        src={service.foto ? service.foto : "/placeholder.svg"}
        alt={service.nombre}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{service.nombre}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {service.categoria}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <img
            src={
              service.prestador?.imagen ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                service.prestador?.nombre
              )}&background=0D8ABC&color=fff`
            }
            alt={service.prestador?.nombre}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">
            {service.prestador?.nombre}
          </span>
        </div>
        {/* Aquí agregamos la visualización de las estrellas */}
        {/* Usamos service.valoracionPromedio para la calificación del servicio */}
        {/* Asegúrate de que valoracionPromedio venga del backend en el ServiceDto */}
        <div className="flex items-center mb-3">
          <StarRatingDisplay rating={service.valoracionPromedio || 0} />
          {/* Opcional: Mostrar el número de reseñas si el backend lo proporciona */}
          {service.reviewsCount && (
            <span className="text-sm text-gray-600 ml-2">
              ({service.reviewsCount} reseñas)
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.descripcion}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600">
            ${service.precio}/hora
          </span>
          <Link to={`/service/${service.id}`} className="btn-secondary text-sm">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
