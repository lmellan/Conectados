
"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { users } from "../data/mockData";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [canAcceptTerms, setCanAcceptTerms] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const existingUser = users.find((user) => user.email === formData.email);
    if (existingUser) {
      setError("Este correo electrónico ya está registrado");
      return;
    }

    if (!termsAccepted) {
      // Establece el error si los términos no han sido aceptados
      setError("Debes aceptar los términos y condiciones");
      return; // Detiene la ejecución de la función si no se aceptan los términos
  }

    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isProfessional: false,
      image: "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    register(newUser);
    navigate("/user-dashboard");
  };

  return (
    <>
      {showTermsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Términos y Condiciones</h3>
            <div
              className="border p-4 h-48 overflow-y-auto"
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target;
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                  setCanAcceptTerms(true);
                }
              }}
            >
              <pre className="whitespace-pre-wrap">
              TÉRMINOS Y CONDICIONES DE USO DE LA PLATAFORMA "CONECTADOS"

Fecha de última actualización: 13-05-2025

Bienvenido(a) a Conectados. Al acceder y utilizar nuestra plataforma web ("la Plataforma"), tú ("Usuario") aceptas estar legalmente vinculado(a) por los presentes Términos y Condiciones de Uso ("Términos"). Si no estás de acuerdo con estos Términos, no debes acceder ni utilizar la Plataforma.

La Plataforma es operada por Conectados S.A., ubicada en Av. España 1560.

1. Definiciones

    Plataforma: Se refiere al sitio web "Conectados" y a todas las funcionalidades, aplicaciones y servicios que ofrece.
    Usuario(s): Se refiere a cualquier persona que accede o utiliza la Plataforma, ya sea como Cliente o Prestador.
    Cliente(s): Usuario que utiliza la Plataforma para buscar y contratar servicios a domicilio.
    Prestador(es): Usuario que utiliza la Plataforma para ofrecer y agendar sus servicios a domicilio.
    Servicio(s): Las tareas o trabajos a domicilio ofrecidos por los Prestadores a través de la Plataforma.
    Contenido: Cualquier información, texto, imagen, video, listado de servicios, perfil de usuario, reseña, etc., que los Usuarios publican o transmiten a través de la Plataforma.

2. Aceptación de los Términos

Al registrarte como Usuario, acceder o utilizar la Plataforma, declaras que has leído, entendido y aceptado estos Términos en su totalidad. Estos Términos constituyen un acuerdo legal vinculante entre tú y [Nombre de tu Empresa/Entidad Legal].

3. Registro de Cuenta

    Para ofrecer o contratar Servicios, debes registrarte y crear una cuenta de Usuario.
    Debes proporcionar información precisa, completa y actualizada durante el proceso de registro.
    Eres el único responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes notificar a Conectados inmediatamente si sospechas de un uso no autorizado de tu cuenta.   

    Conectados se reserva el derecho de suspender o cancelar cuentas que contengan información falsa o incompleta.

4. Naturaleza de la Plataforma

    La Plataforma es un espacio de encuentro que facilita la conexión entre Clientes y Prestadores.
    Conectados NO es un empleador de los Prestadores. Los Prestadores son trabajadores independientes que ofrecen sus servicios directamente a los Clientes.
    Conectados NO es responsable de la calidad, seguridad, legalidad o idoneidad de los Servicios ofrecidos o realizados por los Prestadores. La elección de contratar a un Prestador es responsabilidad exclusiva del Cliente, y la decisión de aceptar un trabajo es responsabilidad exclusiva del Prestador.
    Conectados NO interviene en la relación contractual entre Cliente y Prestador. Cualquier acuerdo de servicio es un contrato directo entre ellos.

5. Responsabilidades de los Usuarios

    Responsabilidades Generales del Usuario:
        Cumplir con todas las leyes y regulaciones aplicables al usar la Plataforma y ofrecer/contratar Servicios.
        Utilizar la Plataforma de manera ética y respetuosa.
        No publicar Contenido ilegal, difamatorio, fraudulento, engañoso, obsceno o que infrinja derechos de propiedad intelectual.
        No utilizar la Plataforma para enviar spam, publicidad no solicitada o cualquier forma de comunicación masiva.
        No intentar dañar, deshabilitar, sobrecargar o comprometer la seguridad de la Plataforma.
    Responsabilidades del Cliente:
        Proporcionar información precisa y detallada al solicitar un Servicio.
        Cumplir con los acuerdos de pago pactados directamente con el Prestador.
        Garantizar un entorno seguro para que el Prestador realice el Servicio.
    Responsabilidades del Prestador:
        Ofrecer Servicios para los que tienes la calificación, habilidad y permisos necesarios.
        Realizar los Servicios con profesionalismo y diligencia.
        Cumplir con los acuerdos pactados con el Cliente, incluyendo horarios y precios.
        Cumplir con todas las obligaciones legales y fiscales relacionadas con la prestación de tus servicios (ej. impuestos, permisos).
        Asegurarte de que la información de tu perfil y listados de Servicios sea precisa y veraz.

6. Listados de Servicios y Solicitudes

    Los Prestadores son responsables de la exactitud y legalidad de los Servicios que listan.
    Los Clientes son responsables de la claridad y veracidad de sus solicitudes de Servicio.
    Conectados se reserva el derecho de eliminar listados o solicitudes que infrinjan estos Términos o que considere inapropiados.

7. Agendamiento y Comunicación

    La Plataforma proporciona herramientas para facilitar el agendamiento y la comunicación entre Usuarios.
    Los Usuarios son responsables de la comunicación clara y oportuna entre ellos para coordinar los Servicios.
    Conectados no garantiza la disponibilidad de Prestadores o Clientes ni la confirmación de agendamientos.

8. Pagos y Tarifas

        "La determinación y el pago de las tarifas por los Servicios son acuerdos directos entre el Cliente y el Prestador. Conectados no procesa pagos ni se hace responsable de disputas relacionadas con pagos directos."
        "Conectados puede cobrar por tarifa de promoción. Estas tarifas serán comunicadas claramente antes de cualquier transacción."
        "Si Conectados implementa un sistema de pago integrado en el futuro, se añadirán términos específicos sobre procesamiento de pagos."
    Conectados no es responsable por incumplimientos de pago, fraude o cualquier otra disputa financiera entre Clientes y Prestadores.

9. Contenido del Usuario

    Tú eres el único responsable del Contenido que publicas en la Plataforma.
    Al publicar Contenido, otorgas a Conectados una licencia no exclusiva, transferible, sublicenciable, mundial y libre de regalías para usar, copiar, modificar, crear obras derivadas, distribuir, publicar y explotar dicho Contenido en relación con la operación y promoción de la Plataforma.
    Conectados se reserva el derecho (pero no la obligación) de revisar, monitorear, eliminar o editar Contenido que considere inapropiado o que viole estos Términos.

10. Propiedad Intelectual

    Todo el material en la Plataforma, incluyendo software, diseño, textos, gráficos, logotipos, etc. (excluyendo el Contenido del Usuario), es propiedad de Conectados o sus licenciantes y está protegido por leyes de propiedad intelectual.
    Se te otorga una licencia limitada, no exclusiva e intransferible para usar la Plataforma para tu uso personal y no comercial, de acuerdo con estos Términos.

11. Exclusión de Garantías

    LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO, YA SEAN EXPRESAS O IMPLÍCITAS.
    CONECTADOS NO GARANTIZA QUE LA PLATAFORMA SERÁ ININTERRUMPIDA, SEGURA O LIBRE DE ERRORES, NI GARANTIZA LA CALIDAD, IDONEIDAD O DISPONIBILIDAD DE LOS SERVICIOS OFRECIDOS POR LOS PRESTADORES.

12. Limitación de Responsabilidad

    EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY, CONECTADOS NO SERÁ RESPONSABLE POR NINGÚN DAÑO DIRECTO, INDIRECTO, INCIDENTAL, ESPECIAL, CONSECUENTE O PUNITIVO QUE SURJA DEL O ESTÉ RELACIONADO CON:
        TU ACCESO O USO DE LA PLATAFORMA.
        CUALQUIER CONDUCTA O CONTENIDO DE OTROS USUARIOS O TERCEROS EN LA PLATAFORMA.
        LOS SERVICIOS CONTRATADOS O PRESTADOS A TRAVÉS DE LA PLATAFORMA.
        CUALQUIER PROBLEMA DE PAGO O DISPUTA ENTRE USUARIOS.

13. Indemnización

Te comprometes a indemnizar, defender y eximir de responsabilidad a Conectados, sus directivos, empleados y agentes, de cualquier reclamación, responsabilidad, daño, pérdida y gasto, incluyendo honorarios legales razonables, que surjan de o estén relacionados con: tu acceso o uso de la Plataforma; tu Contenido; tu incumplimiento de estos Términos; tu interacción con otros Usuarios; o tu violación de cualquier ley o derechos de un tercero.

14. Modificaciones de los Términos

Conectados se reserva el derecho de modificar estos Términos en cualquier momento. Te notificaremos sobre cambios importantes publicando los nuevos Términos en la Plataforma o por otros medios. El uso continuado de la Plataforma después de la fecha efectiva de los cambios constituye tu aceptación de los nuevos Términos.  

15. Terminación

Conectados puede suspender o cancelar tu acceso a la Plataforma en cualquier momento, con o sin causa, con o sin previo aviso. Puedes cerrar tu cuenta en cualquier momento siguiendo las instrucciones en la Plataforma. Las disposiciones de estos Términos que por su naturaleza deberían sobrevivir a la terminación, sobrevivirán a la terminación (incluyendo, sin limitación, propiedad, exclusión de garantías, limitación de responsabilidad e indemnización).

16. Ley Aplicable y Resolución de Disputas

Estos Términos se regirán e interpretarán de acuerdo con las leyes de Chile, sin dar efecto a principios de conflicto de leyes. Cualquier disputa que surja de o esté relacionada con estos Términos se someterá a arbitraje.

17. Contacto

Si tienes preguntas sobre estos Términos, por favor contáctanos en admin@conectados.com
              </pre>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                disabled={!canAcceptTerms}
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className={`px-4 py-2 rounded text-white ${
                  canAcceptTerms
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Crear una cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setShowTermsModal(true)}
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Acepto los{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-medium text-green-600 hover:text-green-500 underline"
                  >
                    términos y condiciones
                  </button>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Registrarme
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
