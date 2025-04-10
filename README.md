# Text Forge - Generador de Texto con IA

Text Forge es una aplicación web que utiliza inteligencia artificial para generar diferentes tipos de contenido de texto, específicamente enfocado en la creación de emails y campañas de marketing.

## Características

- Generador de campañas de marketing por email
- Redactor de respuestas automáticas a emails
- Redactor de emails personalizados
- Interfaz moderna y fácil de usar
- Diseño responsive

## Requisitos

- Python 3.8 o superior
- Cuenta en Cohere para obtener una API key

## Instalación

1. Clona este repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd text-forge
```

2. Crea un entorno virtual e instala las dependencias:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Crea un archivo `.env` en la raíz del proyecto y añade tu API key de Cohere:
```
COHERE_API_KEY=tu_api_key_aqui
```

## Uso

1. Inicia el servidor Flask:
```bash
python app.py
```

2. Abre tu navegador y visita `http://localhost:5000`

3. Selecciona el tipo de generador que deseas usar:
   - Campaña de Email: Para crear campañas de marketing
   - Respuesta Automática: Para generar respuestas a emails
   - Redactor de Emails: Para crear emails personalizados

4. Completa el formulario con los detalles necesarios y haz clic en "Generar"

## Despliegue en PythonAnywhere

1. Crea una cuenta en [PythonAnywhere](https://www.pythonanywhere.com/)
2. Sube los archivos del proyecto
3. Configura un entorno virtual e instala las dependencias
4. Configura el archivo `.env` con tu API key
5. Configura el archivo WSGI para que apunte a tu aplicación Flask
6. Reinicia la aplicación

## Tecnologías Utilizadas

- Flask (Backend)
- Cohere (API de IA)
- LangChain (Framework de IA)
- HTML, CSS, JavaScript (Frontend)

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 