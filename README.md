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
    *   Correo Electrónico (si está disponible, buscando en la web del negocio)
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

## 🛑 Detener el Proceso
Si deseas detener la búsqueda en cualquier momento, presiona `Ctrl + C`. El script te preguntará "¿Estás seguro de que quieres detenerlo?".
- Escribe `y` para salir.
- Escribe `n` para continuar.

## 📝 Estructura del Excel

El archivo `results.xlsx` tendrá las siguientes columnas:

| Business Name | Phone Number | Website | Email | Location |
| :--- | :--- | :--- | :--- | :--- |
| Nombre del Local | (555) 123-4567 | www.ejemplo.com | info@ejemplo.com | 123 Main St, Orem, UT |

---

## 📋 Categorías de Negocio (Sugerencias)

Aquí tienes una lista de más de 100 categorías en inglés que puedes usar para buscar:

1. Accountant
2. Advertising Agency
3. Air Conditioning Contractor
4. Airport
5. Ambulance Service
6. Animal Shelter
7. Antique Store
8. Aquarium
9. Architect
10. Art Gallery
11. Art Supply Store
12. Attorney
13. Auto Body Shop
14. Auto Parts Store
15. Auto Repair Shop
16. Bakery
17. Bank
18. Bar
19. Barber Shop
20. Beauty Salon
21. Bicycle Store
22. Book Store
23. Bowling Alley
24. Brewery
25. Bridal Shop
26. Building Material Store
27. Bus Station
28. Cafe
29. Campground
30. Car Dealer
31. Car Rental
32. Car Wash
33. Carpenter
34. Carpet Store
35. Caterer
36. Cemetery
37. Child Care Agency
38. Chiropractor
39. Church
40. City Hall
41. Clothing Store
42. Computer Store
43. Construction Company
44. Consultant
45. Convenience Store
46. Cosmetics Store
47. Courthouse
48. Day Care Center
49. Dentist
50. Department Store
51. Dermatologist
52. Doctor
53. Drugstore
54. Dry Cleaner
55. Electrician
56. Electronics Store
57. Embassy
58. Engineer
59. Event Planner
60. Factory
61. Farm
62. Fire Station
63. Florist
64. Funeral Home
65. Furniture Store
66. Gas Station
67. General Contractor
68. Gift Shop
69. Glass & Mirror Shop
70. Golf Course
71. Grocery Store
72. Gym
73. Hair Salon
74. Hardware Store
75. Health Food Store
76. Hospital
77. Hotel
78. HVAC Contractor
79. Ice Cream Shop
80. Insurance Agency
81. Interior Designer
82. Jewelry Store
83. Laboratory
84. Laundry
85. Lawyer
86. Library
87. Locksmith
88. Lodging
89. Marketing Agency
90. Mechanic
91. Medical Center
92. Movie Theater
93. Moving Company
94. Museum
95. Nail Salon
96. Night Club
97. Optometrist
98. Painter
99. Park
100. Parking
101. Pet Store
102. Pharmacy
103. Photographer
104. Physiotherapist
105. Plumber
106. Police
107. Post Office
108. Real Estate Agency
109. Restaurant
110. Roofer
111. School
112. Shoe Store
113. Shopping Mall
114. Spa
115. Stadium
116. Storage
117. Supermarket
118. Taxi Stand
119. Travel Agency
120. University
121. Veterinarian
122. Web Design Company
123. Wedding Planner
124. Winery
125. Zoo

---

⚠️ **Nota Importante**: Este script utiliza la API de Google, lo cual puede generar costos si realizas una cantidad masiva de búsquedas. Revisa tu consola de Google Cloud para monitorear el uso.

¡Feliz Scraping! 🕷️✨
