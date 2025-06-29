// frontend-conectados/src/components/TestimonialCard.jsx
import React from "react";
// Importamos el nuevo componente de estrellas
import StarRatingDisplay from "./StarRatingDisplay";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={testimonial.userImage || "/placeholder.svg"}
          alt={testimonial.userName}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold">{testimonial.userName}</h4>
          {/* ¡Reemplazamos el div con la lógica de estrellas por el nuevo componente! */}
          <StarRatingDisplay rating={testimonial.rating} />
        </div>
      </div>
      <p className="text-gray-600 italic">"{testimonial.text}"</p>
      <p className="mt-2 text-sm text-gray-500">
        Servicio: {testimonial.service}
      </p>
    </div>
  );
};

export default TestimonialCard;
