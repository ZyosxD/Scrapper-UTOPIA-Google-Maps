# 🌐 Scraper de Negocios - Utopia Fiber & Google Places

¡Bienvenido! Este script es una herramienta eficiente diseñada para extraer información de negocios en áreas con cobertura de **Utopia Fiber**. Utiliza la **API de Google Places** para buscar negocios por categoría y guarda los resultados ordenadamente en un archivo Excel.

## 🚀 Funcionalidades

*   **🔍 Búsqueda Inteligente**: Busca negocios basados en una categoría (Rubro) específica (ej. "Cafetería", "Dentista", "Restaurante").
*   **🗺️ Cobertura Utopia Fiber**: Busca automáticamente en una lista predefinida de ciudades conectadas a la red de Utopia Fiber (ej. Orem, Murray, West Valley City).
*   **📂 Gestión de Excel**:
    *   **No sobrescribe**: Agrega nuevos datos al final del archivo existente.
    *   **Anti-duplicados**: Verifica si un negocio ya existe (por teléfono o dirección) para evitar repeticiones.
*   **📄 Datos Extraídos**:
    *   Nombre del Negocio
    *   Teléfono
    *   Sitio Web
    *   Correo Electrónico (si está disponible)
    *   Ubicación / Dirección

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

1.  **Node.js**: Debes tener instalado Node.js en tu computadora. [Descargar aquí](https://nodejs.org/).
2.  **Clave de API de Google Places**: Necesitas una API Key válida de Google Cloud con la **Places API (New)** o **Places API (Legacy)** habilitada.
    *   *Nota: La API de Google requiere una cuenta de facturación activa, aunque tiene una capa gratuita generosa.*

## 📦 Instalación

Sigue estos pasos para configurar el proyecto:

1.  **Descargar el código**: Clona este repositorio o descarga los archivos en una carpeta.
2.  **Abrir la terminal**: Navega hasta la carpeta del proyecto.
3.  **Instalar dependencias**: Ejecuta el siguiente comando para instalar las librerías necesarias:
    ```bash
    npm install
    ```

## ⚙️ Configuración (Opcional)

Puedes configurar tu API Key de dos formas:

1.  **Archivo `.env`** (Recomendado):
    *   Crea un archivo llamado `.env` en la raíz del proyecto.
    *   Agrega la siguiente línea:
        ```text
        GOOGLE_API_KEY=tu_clave_de_api_aqui
        ```
2.  **Entrada Manual**: Si no creas el archivo `.env`, el script te pedirá la clave cada vez que lo inicies.

## ▶️ Cómo Usar

1.  Ejecuta el script con el comando:
    ```bash
    node index.js
    ```
2.  **Ingresa la API Key** (si no está en el `.env`).
3.  **Escribe el Rubro**: El script te preguntará qué tipo de negocio buscar (ej. "Pizza", "Gym", "Plomero").
4.  **Espera**: El script buscará ciudad por ciudad. Verás el progreso en la consola.
    *   *Nota: El proceso toma unos segundos por ciudad para respetar los límites de la API.*
5.  **Revisar Resultados**: Al finalizar, abre el archivo `results.xlsx` generado en la misma carpeta.

## 📝 Estructura del Excel

El archivo `results.xlsx` tendrá las siguientes columnas:

| Business Name | Phone Number | Website | Email | Location |
| :--- | :--- | :--- | :--- | :--- |
| Nombre del Local | (555) 123-4567 | www.ejemplo.com | | 123 Main St, Orem, UT |

---

⚠️ **Nota Importante**: Este script utiliza la API de Google, lo cual puede generar costos si realizas una cantidad masiva de búsquedas. Revisa tu consola de Google Cloud para monitorear el uso.

¡Feliz Scraping! 🕷️✨
