"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`${className || ""}`}>
      <div className="flex w-full max-w-3xl">
        <input
          type="text"
          placeholder="¿Qué servicio necesitas?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field rounded-r-none flex-grow"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-r-md transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
