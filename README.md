# Text Forge - AI Text Generator

Text Forge is a web application that uses artificial intelligence to generate different types of text content, specifically focused on creating emails and marketing campaigns.

## Features

- Email marketing campaign generator
- Automatic email response writer
- Personalized email writer
- Modern and easy-to-use interface
- Responsive design

## Requirements

- Python 3.8 or higher
- Cohere account to obtain an API key

## Installation

1. Clone this repository:
```bash
git clone [REPOSITORY_URL]
cd text-forge
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create a `.env` file in the root of the project and add your Cohere API key:
```
COHERE_API_KEY=your_api_key_here
```

## Usage

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and visit `http://localhost:5000`

3. Select the type of generator you want to use:
   - Email Campaign: To create marketing campaigns
   - Auto Reply: To generate responses to emails
   - Email Writer: To create personalized emails

4. Fill out the form with the necessary details and click "Generate"

## Technologies Used

- Flask (Backend)
- Cohere (AI API)
- LangChain (AI Framework)
- HTML, CSS, JavaScript (Frontend)

## License

This project is under the MIT License. See the `LICENSE` file for more details. 