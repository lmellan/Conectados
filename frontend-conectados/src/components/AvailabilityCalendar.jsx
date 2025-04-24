const AvailabilityCalendar = ({ availability }) => {
  const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Disponibilidad</h3>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium mb-2">{day}</div>
            <div
              className={`h-8 rounded-md flex items-center justify-center text-sm
                ${
                  availability.includes(index)
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-400"
                }`}
            >
              {availability.includes(index) ? "Sí" : "No"}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        * Horario habitual: 9:00 AM - 6:00 PM
      </p>
    </div>
  );
};

export default AvailabilityCalendar;
