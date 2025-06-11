
# Conectados

"Conectados" es una plataforma web que conecta a personas que ofrecen servicios a domicilio (como peluquería, electricidad, jardinería, etc.) con quienes los necesitan, de forma rápida, segura y confiable.  
El proyecto está licenciado bajo **MIT License**.

Link a video: https://youtu.be/A9TpElE2ETc

## Wiki

Puedes acceder a la Wiki del proyecto desde el siguiente [enlace](https://github.com/lmellan/Conectados/wiki).

## Instalación del Proyecto

### 0. Clonar el repositorio

Abre tu terminal o línea de comandos y clona el repositorio:

```bash
git clone https://github.com/ConectadoTeam/Conectados.git
cd Conectados
````


### 1. Configuración de la base de datos MySQL

Este proyecto usa **MySQL** como base de datos. Asegúrate de tenerlo instalado.

#### En **Linux** (terminal Bash):

```bash
# 1. Inicia el servicio de MySQL (si no está corriendo)
sudo service mysql start

# 2. Conéctate como root (o tu usuario)
mysql -u root -p
```

Luego, dentro de la consola de MySQL:

```sql
CREATE DATABASE conectados;
USE conectados;
```

#### En **Windows** (CMD o PowerShell):

1. Abre el cliente de MySQL (por ejemplo: `MySQL Command Line Client` o CMD con MySQL en el PATH).

```bash
mysql -u root -p
```

2. Luego, dentro de la consola de MySQL:

```sql
CREATE DATABASE conectados;
USE conectados;
```


### 2. Configurar la conexión en el backend

Edita el archivo:

```bash
backend-conectados/src/main/resources/application.properties
```

Con el siguiente contenido (ajustando las credenciales según tu entorno):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/conectados
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```


### 3. Instalación de dependencias

#### Frontend

```bash
cd frontend-conectados
npm install
```

#### Backend

Asegúrate de tener **Java 17+** y **Maven**. Puedes compilar con:

```bash
cd backend-conectados
./mvnw clean install
```

##  Levantar el Proyecto

### Backend

Desde la carpeta `backend-conectados`, ejecuta:

```bash
./mvnw spring-boot:run
```

### Frontend

Desde la carpeta `frontend-conectados`, ejecuta:

```bash
npm start
```

La app estará disponible por defecto en:
[http://localhost:3000](http://localhost:3000)

## Correr los tests unitarios de backend:
```bash
cd backend-conectados
mvn test
```


## Docker (opcional)

El proyecto incluye una carpeta `docker/` con configuración para levantar un contenedor de **MySQL**, que puede usarse tanto en desarrollo local como dentro del pipeline de integración continua.

## Jenkins (Integración Continua)

El archivo `Jenkinsfile` define un pipeline de CI para compilar y probar automáticamente el proyecto en un entorno Jenkins.  
Incluye pasos para levantar la base de datos, compilar el backend y frontend, y ejecutar tests.


## Estructura del Proyecto

```
Conectados/
├── backend-conectados/       # Proyecto Java Spring Boot
├── frontend-conectados/      # Aplicación React.js
├── docker/                   # Archivos de configuración Docker (base de datos, despliegue local)
├── Jenkinsfile               # Pipeline Jenkins para integración continua
├── docs/                     # Documentación complementaria (videos, referencias)
├── .gitignore
├── LICENSE
├── README.md

```


### 1. Estructura del backend (`backend-conectados/`)


```
backend-conectados/
├── src/
│   └── main/
│       ├── java/
│       │   └── com.conectados.conect/
│       │       ├── cita/              # Módulo de citas 
│       │       ├── servicio/          # Módulo de servicios y reseñas de prestadores
│       │       ├── user/              # Módulo de usuarios 
│       │       └── ConectadosApplication.java  # Clase principal que lanza la aplicación
│       └── resources/
│           └── application.properties # Archivo de configuración general (DB, puerto, JPA, etc.)
│
├── target/               # Archivos compilados (generados por Maven)
├── pom.xml               # Configuración de dependencias y plugins del proyecto (Maven)
```

#### Subestructura típica de cada módulo (`cita`, `servicio`, `user`):

* `controller/`: Controladores REST que exponen los endpoints públicos.
* `entities/`: Clases que representan entidades persistentes (tablas de la base de datos).
* `repositories/`: Interfaces que gestionan el acceso a datos usando Spring Data JPA.
* `services/`: Contiene la lógica de negocio de cada entidad.

> **Nota:** El módulo `servicio/` incluye tanto los archivos de servicios como de reseñas.

### 2. Estructura del frontend (`frontend-conectados/`)

```
frontend-conectados/
├── public/                        # Archivos públicos (favicon, index.html, etc.)
├── src/                           # Código fuente principal del frontend
│   ├── components/                
│   ├── context/                   
│   ├── data/                      
│   ├── pages/                     
│   ├── App.js                     # Componente principal que define la estructura general de la app
│   ├── App.css                    # Estilos globales para App.js
│   ├── App.test.js                # Pruebas del componente App
│   ├── index.js                   # Punto de entrada de la aplicación React
│   ├── index.css                  # Estilos base del proyecto
│   ├── logo.svg                   # Logo u otros recursos SVG
│   ├── reportWebVitals.js         # Medición del rendimiento (opcional)
│   └── setupTests.js              # Configuración para pruebas unitarias con testing-library o jest
│
├── .gitignore                     # Archivos/paths ignorados por git
├── package.json                   # Dependencias y scripts del proyecto React
├── package-lock.json              # Versión exacta de dependencias instaladas
├── README.md                      # Documentación básica del proyecto
└── tailwind.config.js             # Configuración personalizada de TailwindCSS
```

* `components/`: Componentes reutilizables de interfaz de usuario como botones, tarjetas, formularios, modales, etc. Cada componente tiene su archivo `.jsx` y `.test.jsx`.
* `context/`: Contiene definiciones de React Context para manejar estado global de la aplicación (por ejemplo, autenticación, temas, carrito de compras, etc.).
* `data/`: Archivos de datos estáticos, listas, constantes, mocks para pruebas o datos temporales que no provienen de una API.
* `pages/`: Vistas principales o pantallas completas del sistema (como Login, Home, Perfil). Cada archivo `.jsx` representa una ruta si se usa React Router, e incluye su archivo de prueba `.test.jsx`.

## Cómo usar

### 1. Vista de inicio

Al ingresar a localhost:3000, verás la pantalla de bienvenida con acceso a funcionalidades clave. Desde esta vista puedes:

* Registrarte como usuario usando el botón “Registrarse” (rol inicial: Buscador)
* Iniciar sesión si ya tienes una cuenta, usando el botón “Iniciar Sesión”
* Explorar la plataforma o acceder a “Buscar Servicios” (requiere sesión iniciada)

La página también muestra:

* Categorías destacadas (Limpieza, Electricidad, etc.)
* Servicios destacados (si los hay)
* Un buscador de servicios no funcional en esta etapa (requiere sesión iniciada)

> **Nota:** La barra de búsqueda inicial **no está funcional** en esta etapa pública. Para hacer búsquedas reales, debes ingresar como usuario registrado y acceder al buscador desde el panel correspondiente.

### 2. Registro de usuarios

El sistema ahora utiliza un **registro único**. Al registrarte, se crea una cuenta con rol inicial de **Buscador**, desde donde puedes explorar servicios y agendar citas.

El formulario solicita:

* Nombre completo  
* Correo electrónico  
* Número de teléfono  
* Contraseña y confirmación  
* Aceptación de los términos y condiciones

Una vez registrado, puedes iniciar sesión y acceder a tu **panel personal**.

Desde allí tienes la opción de **“Ofrecer Servicios”**, donde puedes activar el rol de **Prestador** completando un formulario adicional con los siguientes datos (RFN-14):

* **Categorías de servicio** ofrecido (ej. Electricista, Peluquero, Jardinero, etc.)
* **Zona de atención** geográfica
* **Descripción de los servicios** ofrecidos
* **Disponibilidad semanal** (días laborales)
* **Disponibilidad horaria**

> **Importante:** Esto te permitirá tener ambos roles desde una sola cuenta, manteniendo historial y funcionalidades completas.

> **Nota:** Actualmente, al cambiar de rol o activar el rol de prestador, el sistema redirige a la página de inicio. Para ver correctamente la vista del nuevo rol, simplemente presiona nuevamente el botón **"Mi Panel"**.

### 3. Búsqueda y exploración de servicios

Una vez logueado como **buscador**:

* Dirígete a la sección "Buscar Servicios"
* Usa filtros como **categoría**, **precio** y **región** para encontrar lo que necesitas
* Haz clic en **"Ver detalles"** para revisar información completa del servicio:

  * Nombre del prestador
  * Precio por hora
  * Descripción
  * Días disponibles
  * Reseñas de otros usuarios

### 4. Agendar un servicio

Desde la vista de detalle del servicio:

* Selecciona una fecha y hora disponible
* Haz clic en **"Solicitar Servicio"**
* El sistema agenda automáticamente la cita, visible tanto para el buscador como para el prestador

> **Nuevo:** Una vez agendada la cita, tanto el **buscador** como el **prestador** podrán **contactarse directamente por WhatsApp** desde la sección de citas, siempre que ambos tengan registrado su número de teléfono (RFN-10).  
> Si alguno no tiene número registrado, el sistema mostrará un mensaje indicándolo.

### 5. Panel del usuario (Buscador)

Desde **"Mi Panel"** puedes:

* Consultar tus próximas citas
* Acceder a tu historial de servicios
* Cancelar citas programadas
* **Dejar reseñas**, siempre que se cumpla lo siguiente:

> **Restricción:** Solo se puede dejar una reseña **si la cita fue completada**. Esto ocurre automáticamente cuando la fecha agendada ya pasó y la cita **no fue cancelada**.  
> Las reseñas se realizan desde el **historial de servicios**, seleccionando la opción disponible para cada cita completada.

* **Contactar al prestador** por WhatsApp si ya agendaste con él y tiene número disponible (RFN-10)
* **Activar el rol de prestador** desde tu cuenta completando los datos adicionales (RFN-14)

> Recuerda: tras activar el nuevo rol o cambiar de vista, vuelve a presionar **"Mi Panel"** para ver correctamente la interfaz correspondiente.

### 6. Panel del profesional (Prestador)

Una vez activado el rol de **Prestador** desde tu cuenta, accedes a un panel especializado que permite:

* Publicar nuevos servicios completando el formulario correspondiente
* Modificar o eliminar servicios existentes en cualquier momento
* Revisar y gestionar las **citas agendadas** por los buscadores
* Ver los **comentarios y calificaciones** recibidas por cada servicio
* **Contactar directamente al buscador** de una cita mediante WhatsApp, si tiene número registrado (RFN-10)

> Si deseas volver a buscar servicios, puedes usar la funcionalidad de **cambio de rol** desde el mismo panel, sin necesidad de crear una nueva cuenta.



## Cómo contribuir

Si deseas contribuir al proyecto, sigue estos pasos utilizando **GitFlow** de para mantener una estructura organizada en el desarrollo:

### Flujo de trabajo con GitFlow 

1. **Haz un Fork del repositorio**: Ve a GitHub y haz un fork del repositorio para tener tu propia copia en tu cuenta.

2. **Clona el repositorio**: Clona tu fork localmente usando el siguiente comando:
   ```bash
   git clone https://github.com/tu_usuario/Conectados.git
   ```
   Luego, entra al directorio del proyecto:
   ```bash
   cd nombre_directorio
   ```

3. **Añade el repositorio original como remoto**: Para poder sincronizar cambios con el repositorio principal, agrégalo como un nuevo remoto:
   ```bash
   git remote add upstream https://github.com/repo-original/Conectados.git
   ```
   Verifica los remotos configurados con:
   ```bash
   git remote -v
   ```

4. **Crea una nueva rama de desarrollo (develop)**:  
   Si el repositorio no tiene una rama `develop`, créala y súbela:
   ```bash
   git checkout -b develop
   git push origin develop
   ```

5. **Mantén tu repositorio actualizado**: Antes de trabajar en una nueva funcionalidad, asegúrate de que tienes la última versión del código:
   ```bash
   git checkout develop
   git pull upstream develop
   ```

6. **Crea una rama para tu funcionalidad**:  
   Si vas a desarrollar una nueva funcionalidad, crea una nueva rama `feature` a partir de `develop`:
   ```bash
   git checkout -b feature/nombre-de-la-funcionalidad develop
   ```

7. **Realiza tus cambios y haz commits**:  
   Edita el código y haz commits siguiendo buenas prácticas:
   ```bash
   git add .
   git commit -m "Descripción clara de la funcionalidad agregada"
   ```

8. **Sube tu rama al repositorio remoto**:
   ```bash
   git push origin feature/nombre-de-la-funcionalidad
   ```

9. **Crea un Pull Request (PR)**:  
   Ve a GitHub y crea un **Pull Request** desde tu rama `feature/nombre-de-la-funcionalidad` hacia la rama `develop` del repositorio principal.

10. **Revisión y fusión**:  
    - Un miembro del equipo revisará tu código.  
    - Si es aprobado, la funcionalidad será fusionada en `develop`.  
    - Si hay cambios solicitados, ajústalos y vuelve a hacer commits en la misma rama.

11. **Eliminar la rama de funcionalidad (opcional)**:  
    Una vez fusionado el PR, elimina la rama localmente y en GitHub:
    ```bash
    git branch -d feature/nombre-de-la-funcionalidad
    git push origin --delete feature/nombre-de-la-funcionalidad
    ```
    
### Reglas para los Pull Requests:
- Cada PR debe estar relacionado con una única funcionalidad o corrección.
- Los tests deben ejecutarse antes de enviar el PR.
- Usa mensajes de commit claros y concisos.
- Todo PR debe ser revisado antes de fusionarse.


## Licencia

Este proyecto está bajo la **MIT License** - ver el archivo [LICENSE](https://github.com/lmellan/Tarea_1-INF331/blob/main/LICENSE) para más detalles.



