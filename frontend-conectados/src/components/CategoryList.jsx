import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Limpieza", icon: "🧹", slug: "limpieza" },
  { id: 2, name: "Electricidad", icon: "💡", slug: "electricidad" },
  { id: 3, name: "Plomería", icon: "🔧", slug: "plomeria" },
  { id: 4, name: "Jardinería", icon: "🌱", slug: "jardineria" },
  { id: 5, name: "Peluquería", icon: "✂️", slug: "peluqueria" },
  { id: 6, name: "Carpintería", icon: "🪚", slug: "carpinteria" },
];

const CategoryList = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/search?category=${category.slug}`}
          className="category-icon flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-3xl mb-2">{category.icon}</span>
          <span className="text-gray-700 text-sm font-medium">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
