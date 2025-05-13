import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchPage from "./SearchPage";
import { services } from "../data/mockData";

// Ignorar warning por act() deprecado
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg) => {
    if (!msg.includes("ReactDOMTestUtils.act")) {
      console.error(msg);
    }
  });
});

// Aumentar el timeout general de Jest para este archivo
jest.setTimeout(15000); // Aumentar a 15 segundos

// Define un matcher de función reusable para "servicio de plomería"
const isPlomeriaService = (content, element) => {
  const normalizedContent = content.toLowerCase();
  return normalizedContent.includes("servicio de plomería");
};

describe("SearchPage", () => {
  beforeEach(() => {
    services.length = 0;
    services.push(
      {
        id: 1,
        title: "Servicio de Plomería",
        description: "Reparación de fugas y cañerías",
        category: "Plomería",
        price: 20000,
        providerId: 1,
        providerName: "Juan Pérez",
        providerImage: "https://randomuser.me/api/portraits/men/1.jpg",
        image: "https://via.placeholder.com/300",
        rating: 4.5,
        reviews: 10,
      },
      {
        id: 2,
        title: "Limpieza profunda",
        description: "Servicio completo para tu hogar",
        category: "Limpieza",
        price: 15000,
        providerId: 2,
        providerName: "María González",
        providerImage: "https://randomuser.me/api/portraits/women/2.jpg",
        image: "https://via.placeholder.com/300",
        rating: 4.8,
        reviews: 20,
      }
    );
  });

  const renderPage = (query = "") =>
    render(
      <MemoryRouter initialEntries={[`/search${query}`]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    const setWidePriceRange = () => {
      const minPriceInput = screen.getByLabelText(/mínimo/i);
      const maxPriceInput = screen.getByLabelText(/máximo/i);
  
      fireEvent.change(minPriceInput, { target: { value: "0" } });
      fireEvent.change(maxPriceInput, { target: { value: "30000" } }); // O un valor que cubra tus precios mock
    };
  
  
    test("renderiza el título y barra de búsqueda", () => {
      renderPage();
      expect(screen.getByText(/buscar servicios/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/qué servicio necesitas/i)).toBeInTheDocument();
    });
  
    test("muestra servicios filtrados por término de búsqueda", async () => {
      // Renderiza inicialmente con el query param
      renderPage("?q=plomería");
  
      // En este punto, searchTerm="plomería" y priceRange=[0, 100]. filteredServices está vacío.
      // Opcional: esperar que el mensaje de "no encontrados" esté presente inicialmente
      // await waitFor(() => screen.findByText(/no se encontraron servicios que coincidan con tu búsqueda/i), { timeout: 5000 });
  
  
      // Ahora, establece un rango de precio amplio para que el servicio de plomería sea visible
      setWidePriceRange(); // Esto dispara el useEffect y el filtrado
  
      // Con searchTerm="plomería" y priceRange=[0, 30000], solo plomería debería estar.
      // Espera a que el servicio de plomería aparezca. Esto confirma que el filtro y renderizado ocurrieron.
      await waitFor(() =>
        expect(screen.getByText(isPlomeriaService)).toBeInTheDocument()
      , { timeout: 5000 });
  
      // Ahora, verifica que el servicio de limpieza NO esté en el documento.
      // No necesitamos esperar su remoción porque no debería estar presente con los filtros actuales.
      expect(screen.queryByText(/limpieza profunda/i)).not.toBeInTheDocument();
    });

  test("filtra por categoría correctamente", async () => {
    renderPage();
    setWidePriceRange(); // Asegura que el rango de precio permita mostrar los servicios

    // Espera a que los servicios aparezcan después de ajustar el rango de precio
     await waitFor(() => expect(screen.getByText(isPlomeriaService)).toBeInTheDocument(), { timeout: 5000 });
     await waitFor(() => expect(screen.getByText(/limpieza profunda/i)).toBeInTheDocument(), { timeout: 5000 });

    // Ahora cambia la categoría a limpieza
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "limpieza" },
    });

    // Espera a que solo aparezca el servicio de limpieza
    await waitFor(() => screen.findByText(/limpieza profunda/i), { timeout: 5000 });

    // Verifica que el servicio de plomería ya no está presente
    expect(screen.queryByText(isPlomeriaService)).not.toBeInTheDocument();
  });


  test("filtra por rango de precio", async () => {
    renderPage();
    setWidePriceRange(); // Empieza con un rango donde ambos servicios son visibles
  
     // Espera a que los servicios aparezcan inicialmente
    await waitFor(() => expect(screen.getByText(isPlomeriaService)).toBeInTheDocument(), { timeout: 5000 });
    await waitFor(() => expect(screen.getByText(/limpieza profunda/i)).toBeInTheDocument(), { timeout: 5000 });
  
  
    // Ahora aplica el filtro de precio específico
    fireEvent.change(screen.getByLabelText(/mínimo/i), {
      target: { value: "16000" },
    });
     // El max price ya es amplio por setWidePriceRange()
  
    // Espera a que solo aparezca el servicio de plomería
    await waitFor(() =>
      expect(screen.getByText(isPlomeriaService)).toBeInTheDocument()
    , { timeout: 5000 });
    expect(screen.queryByText(/limpieza profunda/i)).not.toBeInTheDocument();
  });

  test("muestra mensaje cuando no hay resultados", async () => {
    renderPage();
    // No es necesario setWidePriceRange aquí

    // Aplica un filtro que no coincida con ningún servicio (categoría inexistente o rango de precio muy estrecho/alto)
     fireEvent.change(screen.getByLabelText(/categoría/i), {
       target: { value: "categoria-inexistente" }, // Usa una categoría que no esté en mockData
     });

    await screen.findByText(/no se encontraron servicios/i);
     // Asegúrate de que no haya ServiceCards visibles
     expect(screen.queryByText(isPlomeriaService)).not.toBeInTheDocument();
     expect(screen.queryByText(/limpieza profunda/i)).not.toBeInTheDocument();
  });

  test("restablece los filtros al hacer clic en 'Limpiar filtros'", async () => {
    renderPage();
    setWidePriceRange(); // Empieza con un rango donde los servicios son visibles
  
    // Espera a que los servicios aparezcan inicialmente
    await waitFor(() => expect(screen.getByText(isPlomeriaService)).toBeInTheDocument(), { timeout: 5000 });
  
    // Aplica filtros que *reduzcan* los resultados (e.g., una categoría específica)
    fireEvent.change(screen.getByLabelText(/categoría/i), {
      target: { value: "limpieza" },
    });
    await waitFor(() => screen.findByText(/limpieza profunda/i), { timeout: 5000 });
    expect(screen.queryByText(isPlomeriaService)).not.toBeInTheDocument();
  
    // Click en limpiar filtros
    fireEvent.click(screen.getByRole("button", { name: /limpiar filtros/i }));
  
    // El botón limpiar filtros resetea el precio a [0, 100] y la categoría/término a ""/"all".
    // Dado que el rango [0, 100] excluye los mock services, debemos esperar el mensaje de "no encontrados".
     await waitFor(() => screen.findByText(/no se encontraron servicios que coincidan con tu búsqueda/i, { timeout: 5000 }));
     expect(screen.queryByText(isPlomeriaService)).not.toBeInTheDocument();
     expect(screen.queryByText(/limpieza profunda/i)).not.toBeInTheDocument();
  
  });
});