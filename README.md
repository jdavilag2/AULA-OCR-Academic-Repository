# AULA — Academic OCR Repository

## Descripción del Proyecto

AULA es un repositorio académico diseñado para permitir a los estudiantes almacenar, organizar y consultar apuntes en formato de imagen. El sistema utiliza reconocimiento óptico de caracteres (OCR) para extraer automáticamente el texto de las imágenes subidas, facilitando la búsqueda y el acceso a la información académica.

El proyecto está desarrollado como una aplicación web moderna utilizando Vite, React y TypeScript en el frontend, con Supabase como backend (autenticación, base de datos y almacenamiento de archivos), e интегra la API de OCR Space para el procesamiento de texto.

---

## Funcionalidades

### Subida de Apuntes
- Carga de imágenes de apuntes académicos.
- Registro de título, descripción y materia.
- Almacenamiento de imágenes en Supabase Storage.
- Extracción automática de texto mediante OCR Space.
- Asociación del apunte con el usuario autenticado y fecha de creación.

### Repositorio de Apuntes
- Visualización en tarjetas con vista previa.
- Efecto de zoom suave sobre las imágenes al pasar el cursor.
- Filtro por materias.
- Buscador por título, descripción, texto extraído y materia.
- Modal con información detallada, imagen completa y texto OCR.

### Autenticación
- Registro e inicio de sesión de usuarios.
- Gestión de sesiones mediante Supabase Auth.
- Cierre de sesión seguro.

### OCR
- Integración con la API de OCR Space.
- Procesamiento automático de imágenes subidas.
- Almacenamiento del texto reconocido en la base de datos.

---

## Tecnologías Utilizadas

- React 18
- TypeScript
- Vite
- Supabase (Auth, Database, Storage)
- OCR Space API
- TailwindCSS
- Lucide React Icons
- PostCSS
- Autoprefixer

---
