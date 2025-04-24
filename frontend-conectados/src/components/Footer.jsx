import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Conectados</h3>
            <p className="text-gray-600 mb-4">
              Conectando usuarios con los mejores profesionales para servicios a
              domicilio.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-green-600">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-600 hover:text-green-600"
                >
                  Buscar Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/register-pro"
                  className="text-gray-600 hover:text-green-600"
                >
                  Ofrecer Servicios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-gray-600">
              Email: info@conectados.com
              <br />
              Teléfono: (123) 456-7890
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Conectados – Servicios a un Clic.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
