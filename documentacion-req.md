# Documentación de Requisitos - Feature: Roles en Plataforma Conectados

## ✅ Funcionalidades Implementadas

### 🧩 Gestión de Roles y Navegación

- Se implementó sistema de **múltiples roles por usuario** en el frontend.
- Tras iniciar sesión, si el usuario tiene más de un rol (ej: `BUSCADOR`, `PRESTADOR`), se solicita seleccionar un **rol activo**.
- El panel (`Dashboard`) se ajusta dinámicamente en base al rol activo:
  - Si el rol activo es `BUSCADOR`, se muestra su panel correspondiente.
  - Si el rol activo es `PRESTADOR`, se muestra su panel con herramientas para gestionar servicios.

### 🛠 Gestión de Servicios (Rol: PRESTADOR) Funcionalidades Pendientes

- Ya es posible:
  - ✅ **Crear** servicios
  - ✅ **Eliminar** servicios
- ❌ No se ha implementado aún la funcionalidad de **editar** servicios.

---

### 🔁 Integración de Reservas (Rol: BUSCADOR) Funcionalidades Pendientes

- La lógica de **reserva de servicios por parte de un BUSCADOR** aún no está integrada en el nuevo flujo de roles activos.
- Actualmente, al tener rol activo `BUSCADOR`, no se puede:
  - Ver servicios disponibles para reservar desde la lógica nueva.
  - Confirmar o visualizar reservas correctamente.
- Se requiere adaptar los flujos de reserva al nuevo modelo `rol activo`, tanto en frontend como en backend.

---

## 📌 Consideraciones Técnicas

- El campo `rolActivo` ya está integrado en el frontend vía contexto (`AuthContext`) y se actualiza al momento de seleccionar rol.
- La comunicación con el backend aún no considera `rolActivo` como parte de lógica de autorización o respuesta.
- El sistema de navegación (`React Router`) ya adapta vistas dependiendo del rol, pero aún necesita revisión para asegurar que rutas sensibles estén correctamente protegidas.

---

## 🗂 Ubicación de archivos relevantes

- **Contexto de autenticación y roles activos:**  
  `frontend-conectados/src/context/AuthContext.jsx`
  `frontend-conectados/src/components/Header.jsx`

- **Lógica de dashboards:**  
  `frontend-conectados/src/pages/UserDashboard.jsx`  
  `frontend-conectados/src/pages/ProDashboard.jsx`
  `frontend-conectados/src/pages/BecomeProPage.jsx`

- **Gestión de servicios (crear/eliminar):**  
  `frontend-conectados/src/pages/CreateServicePage.jsx`  
  `frontend-conectados/src/pages/ServiceListPage.jsx`

---

## 🧠 Próximos pasos

1. **Implementar lógica completa de reserva de servicios** desde el lado del buscador, en base al `rolActivo`.
2. Habilitar la **edición de servicios** ya creados.
3. Incorporar validaciones de backend según rol activo.
4. Añadir pruebas unitarias y de integración (Jest) para proteger los nuevos flujos.
4. Añadir nuevas pruebas del backend y de integración (Jest) para proteger los nuevos flujos.
5. Documentar endpoints esperados y sus respuestas según el rol activo.
