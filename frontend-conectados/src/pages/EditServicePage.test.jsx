import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { services } from "../data/mockData";
import EditServicePage from "./EditServicePage";

// Mocks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "100" }),
  };
});

describe("EditServicePage", () => {
  const professionalUser = {
    id: 1,
    name: "Pedro Profesional",
    image: "/user.jpg",
    isProfessional: true,
  };

  const editableService = {
    id: 100,
    title: "Servicio Editado",
    category: "Electricidad",
    description: "Descripción antigua",
    price: 20000,
    image: "/imagen.jpg",
    providerId: 1,
    providerName: "Pedro Profesional",
    providerImage: "/user.jpg",
    rating: 5,
    reviews: 10,
  };

  const renderWithRouter = (user = professionalUser) =>
    render(
      <MemoryRouter initialEntries={["/edit-service/100"]}>
        <AuthContext.Provider value={{ user }}>
          <Routes>
            <Route path="/edit-service/:id" element={<EditServicePage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    services.length = 0;
    services.push({ ...editableService }); // precarga un servicio
  });

  test("redirige si el usuario no está logueado", () => {
    renderWithRouter(null);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("redirige si el usuario no es profesional", () => {
    renderWithRouter({ ...professionalUser, isProfessional: false });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("redirige si el servicio no existe", () => {
    services.length = 0; // borrar servicios
    renderWithRouter();
    expect(mockNavigate).toHaveBeenCalledWith("/pro-dashboard");
  });

  test("redirige si el servicio no pertenece al usuario", () => {
    services[0].providerId = 999;
    renderWithRouter();
    expect(mockNavigate).toHaveBeenCalledWith("/pro-dashboard");
  });

  test("renderiza el formulario con valores pre-cargados", async () => {
    renderWithRouter();

    expect(await screen.findByDisplayValue("Servicio Editado")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descripción antigua")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20000")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/imagen.jpg");
  });

  test("muestra errores si el formulario está incompleto", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Título del servicio/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(await screen.findByText("El título es obligatorio")).toBeInTheDocument();
  });

  test("actualiza el servicio y redirige", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Título del servicio/i), {
      target: { value: "Servicio Modificado" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByLabelText("Formulario de edición de servicio"));
      await new Promise((res) => setTimeout(res, 1100));
    });

    expect(mockNavigate).toHaveBeenCalledWith("/pro-dashboard");
    expect(services[0].title).toBe("Servicio Modificado");
  });
});
