
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from veritas_agents import gemini_handler

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Allow CORS for the extension origin (for local development)
# In production, you might want to restrict this to your extension's ID
CORS(app)

# Basic health check endpoint
@app.route('/')
def index():
    return "Veritas Lens API is running."

@app.route('/verify_claim', methods=['POST'])
def verify_claim():
    """
    Fact-checks a given piece of text.
    Request Body: { "text": "The claim to be fact-checked." }
    """
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    claim_text = data['text']
    try:
        result = gemini_handler.verify_claim_with_ai(claim_text)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in /verify_claim: {e}")
        return jsonify({"error": "Failed to process the claim with AI model."}), 500

@app.route('/generate_counterargument', methods=['POST'])
def generate_counterargument():
    """
    Generates counterarguments for a given statement.
    Request Body: { "text": "The statement to be challenged." }
    """
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    statement_text = data['text']
    try:
        result = gemini_handler.generate_counterarguments_with_ai(statement_text)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in /generate_counterargument: {e}")
        return jsonify({"error": "Failed to generate counterarguments with AI model."}), 500

@app.route('/analyze_transcript', methods=['POST'])
def analyze_transcript():
    """
    Extracts key claims from a video transcript.
    Request Body: { "transcript": "The full text of the video transcript." }
    """
    data = request.get_json()
    if not data or 'transcript' not in data:
        return jsonify({"error": "Missing 'transcript' in request body"}), 400

    transcript = data['transcript']
    try:
        result = gemini_handler.analyze_transcript_with_ai(transcript)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in /analyze_transcript: {e}")
        return jsonify({"error": "Failed to analyze transcript with AI model."}), 500


if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development', port=5000)

