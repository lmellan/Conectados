
# Conectados

"Conectados" es una plataforma web que conecta a personas que ofrecen servicios a domicilio (como peluquería, electricidad, jardinería, etc.) con quienes los necesitan, de forma rápida, segura y confiable.  
El proyecto está licenciado bajo **MIT License**.



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
spring.jpa.hibernate.ddl-auto=update
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



## Estructura del Proyecto

```
Conectados/
├── backend-conectados/       # Proyecto Java Spring Boot
├── frontend-conectados/      # Aplicación React.js
├── .git/                     # Carpeta de control de versiones
├── .gitignore
├── LICENSE
├── package.json              # Metadata general del proyecto (React)
├── package-lock.json
├── README.md
```

---

¿Deseas que te genere esto también en un archivo `README.md` actualizado o `wiki.md` para subirlo directamente?


## Cómo usar

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
