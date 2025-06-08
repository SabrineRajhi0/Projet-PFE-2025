import os
import json
import requests
import re
import fitz  # PyMuPDF
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
if not TOGETHER_API_KEY:
    raise ValueError("TOGETHER_API_KEY not found in environment variables")

# Flask app configuration
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# File validation configuration
ALLOWED_EXTENSIONS = {'pdf'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    if 'file' not in request.files:
        return jsonify({'error': 'Missing file'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Only PDF files are accepted.'}), 400

    try:
        # Lire le contenu du PDF et extraire le texte
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        content = ""
        for page in doc:
            content += page.get_text()

        if not content.strip():
            return jsonify({'error': 'Le document PDF ne contient pas de texte exploitable.'}), 400

        prompt = (
    "Tu es un assistant e-learning expert.\n"
    "Génère un quiz de 10 questions à choix multiples (QCM) en **langue française**.\n"
    "Chaque question doit avoir 4 choix (A, B, C, D) et indiquer la bonne réponse.\n\n"
    f"Contenu du cours :\n{content}\n\n"
    "Retourne uniquement le résultat sous forme d’un tableau JSON comme ceci :\n"
    "[{\"question\": \"...\", \"choices\": [\"A\", \"B\", \"C\", \"D\"], \"answer\": \"A\"}, ...]"
)
# Envoyer la requête API

        # Appel à l’API Together
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {TOGETHER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "meta-llama/Llama-3-70b-chat-hf",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 2048,
                "temperature": 0.7
            }
        )

        if response.status_code != 200:
            return jsonify({"error": f"Together API error {response.status_code}: {response.text}"}), 500

        result = response.json()
        quiz_raw = result['choices'][0]['message']['content'].strip()

        # Debug

        # Extraction JSON propre
        match = re.search(r"\[\s*{.*?}\s*]", quiz_raw, re.DOTALL)
        if not match:
            match = re.search(r"\[.*\]", quiz_raw, re.DOTALL)
        if match:
            quiz_cleaned = match.group(0)
            quiz = json.loads(quiz_cleaned)
        else:
            raise ValueError("No valid JSON array found in model output.")

        return jsonify({'quiz': quiz})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
