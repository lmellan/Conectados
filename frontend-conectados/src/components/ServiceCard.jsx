import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <div className="card">
      <img
        src={service.image || "/placeholder.svg"}
        alt={service.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            {service.category}
          </span>
        </div>
        <div className="flex items-center mb-3">
          <img
            src={service.providerImage || "/placeholder.svg"}
            alt={service.providerName}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">{service.providerName}</span>
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

export default ServiceCard;
