import os
import google.generativeai as genai
import json
import re

# Configuration
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

# Helper Function
def clean_json_response(text_response):
    """
    Cleans the AI's text response to extract a valid JSON object.
    """
    # Find the start and end of the JSON block
    match = re.search(r'```json\s*(\{.*?\})\s*```', text_response, re.DOTALL)
    if match:
        json_str = match.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error after cleaning: {e}")
            return {"error": "Invalid JSON format from AI."}
    else:
        # Fallback for responses without markdown fences
        try:
            return json.loads(text_response)
        except json.JSONDecodeError:
            return {"error": "Could not parse JSON response from AI."}

# AI Agent Prompts

FACT_CHECKER_PROMPT = """
You are an expert, impartial fact-checker AI named Veritas. Your goal is to rigorously verify a given claim using reliable, neutral, and high-authority sources.

**DO NOT** state your own opinions. Your response **MUST** be based solely on verifiable information from the web.

**Claim to Verify:** "{claim_text}"

**Your Task:**
1.  **Analyze the Claim:** Break down the core assertion of the claim.
2.  **Web Search Simulation:** Perform a simulated, thorough search for evidence from diverse, high-authority sources (e.g., major news organizations, scientific journals, academic institutions, government reports). Avoid biased sources, opinion blogs, and user-generated content.
3.  **Synthesize Findings:** Based on the evidence, write a concise, neutral summary of your findings. Explain the context, nuance, and whether the claim is supported, disputed, or lacks sufficient evidence.
4.  **Assign Veracity Score:** Provide a confidence score from 0 to 100, where 0 is "Completely False" and 100 is "Completely True".
5.  **Categorize Veracity:** Based on the score, select one of the following labels: "Highly Misleading", "Mostly False", "Requires Context", "Largely True", "Highly Accurate".
6.  **Cite Sources:** Provide a list of at least 2-3 high-quality sources you used for your analysis.

**Output Format:**
Your entire response **MUST** be a single, valid JSON object enclosed in ```json ... ```. Do not add any text before or after the JSON block.

**JSON Structure:**
json
{{
  "veracity": "Largely True",
  "score": 85,
  "summary": "A concise, neutral summary of the findings, including any necessary context or nuance.",
  "sources": [
    {{"title": "Source Name 1", "url": "[https://example.com/source1](https://example.com/source1)"}},
    {{"title": "Source Name 2", "url": "[https://example.com/source2](https://example.com/source2)"}}
  ]
}}
"""

DIALECTIC_ENGINE_PROMPT = """
You are a master of dialectics and critical thinking. Your purpose is to challenge a given statement by generating well-reasoned, nuanced counterarguments from multiple, diverse perspectives.

**DO NOT** take a side or agree with the original statement. Your role is to present plausible alternative viewpoints to encourage critical thinking.

**Statement to Challenge:** "{statement_text}"

**Your Task:**
1.  **Analyze the Statement:** Identify the core assumptions and assertions in the statement.
2.  **Generate Counterpoints:** Create 2-3 distinct counterarguments. Each counterargument must come from a different perspective.
3.  **Specify Perspectives:** For each counterargument, clearly label its perspective. Use perspectives like: "An Economic Counterpoint", "An Ethical Consideration", "A Social Perspective", "A Technological Rebuttal", "A Skeptical View".
4.  **Reasoning:** Ensure each argument is logical, well-articulated, and provides a clear line of reasoning.

**Output Format:**
Your entire response **MUST** be a single, valid JSON object enclosed in ```json ... ```. Do not add any text before or after the JSON block.

**JSON Structure:**
json
{{
  "counterpoints": [
    {{
      "perspective": "An Economic Counterpoint",
      "argument": "A detailed and well-reasoned argument from an economic viewpoint."
    }},
    {{
      "perspective": "An Ethical Consideration",
      "argument": "A detailed and well-reasoned argument from an ethical viewpoint."
    }}
  ]
}}
"""

TRANSCRIPT_ANALYZER_PROMPT = """
You are an information extraction AI. Your task is to analyze the following video transcript and identify up to 10 of the most significant, verifiable, and factual claims.

**Your Instructions:**
-   **Identify Factual Claims:** A factual claim is a statement that can be proven true or false with evidence.
-   **Ignore Non-Claims:** Ignore opinions, questions, subjective statements, filler words, and conversational fluff.
-   **Be Specific:** Extract the claim as a concise, self-contained statement.
-   **Timestamp:** While a precise timestamp is not in the text, infer a logical placeholder like [00:XX] based on its position if possible, otherwise use a generic placeholder.

**Transcript:**
"{transcript_text}"

**Output Format:**
Your entire response **MUST** be a single, valid JSON object enclosed in ```json ... ```. Do not add any text before or after the JSON block.

**JSON Structure:**
json
{{
  "claims": [
    {{
      "timestamp": "[00:15]",
      "claim": "The first major factual claim identified from the transcript."
    }},
    {{
      "timestamp": "[01:32]",
      "claim": "The second major factual claim identified."
    }}
  ]
}}
"""


# Public Functions

def verify_claim_with_ai(claim_text):
    """Calls the Gemini API with the fact-checker prompt."""
    if not model:
        raise ConnectionError("Gemini model not initialized.")
    prompt = FACT_CHECKER_PROMPT.format(claim_text=claim_text)
    response = model.generate_content(prompt)
    return clean_json_response(response.text)

def generate_counterarguments_with_ai(statement_text):
    """Calls the Gemini API with the dialectic engine prompt."""
    if not model:
        raise ConnectionError("Gemini model not initialized.")
    prompt = DIALECTIC_ENGINE_PROMPT.format(statement_text=statement_text)
    response = model.generate_content(prompt)
    return clean_json_response(response.text)

def analyze_transcript_with_ai(transcript_text):
    """Calls the Gemini API with the transcript analyzer prompt."""
    if not model:
        raise ConnectionError("Gemini model not initialized.")
    prompt = TRANSCRIPT_ANALYZER_PROMPT.format(transcript_text=transcript_text)
    response = model.generate_content(prompt)
    return clean_json_response(response.text)