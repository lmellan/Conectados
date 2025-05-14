# Conectados

"Conectados" es una plataforma web pensada para conectar a personas que ofrecen servicios (como peluquería, electricidad, jardinería y más) con quienes los necesitan, de forma rápida, segura y confiable. El código fuente está disponible bajo la **MIT License**, lo que permite su uso, modificación y distribución de manera abierta.

## Wiki

Puede acceder a la Wiki del proyecto mediante el siguiente [enlace](https://github.com/lmellan/Conectados/wiki).  

## Instalación

### 1. Instalación de la Base de Datos

Este proyecto utiliza **MySQL** como base de datos. Así se puede configurar localmente:

- **Instala MySQL**: Si no lo tienes instalado, descárgalo desde [MySQL Community Server](https://dev.mysql.com/downloads/) e instálalo siguiendo las instrucciones correspondientes.

- **Inicia MySQL**: Asegúrate de que el servicio de MySQL esté corriendo. Puedes iniciarlo con:

linux:
  ```bash
  sudo service mysql start
  ```
windows:
  ```bash
  mysql -u root -p
  ```
  
- **Crea una base de datos**: Abre MySQL desde la terminal o una herramienta como MySQL Workbench y ejecuta:
  
  ```sql
  CREATE DATABASE conectados;
  ```
  
- **Usa la base de datos**: Ejecuta el siguiente comando para trabajar dentro de la base de datos:

  ```sql
  USE conectados;
  ```
### 2. Configurar la Conexión a la Base de Datos

Antes de ejecutar el proyecto, configura la conexión a la base de datos en el archivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/conectados
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

Reemplaza `tu_usuario` y `tu_contraseña` con tus credenciales de MySQL.



Para instalar dependencias ejecuta:
```bash
cd frontend-conectados
npm install
```

## Levantar el Proyecto
```bash
npm start
```

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
