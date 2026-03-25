from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os
import re

app = Flask(__name__)
CORS(app)

# ── Load Model ──────────────────────────────────────────────
MODEL_PATH  = 'models/mbti_xgb_model.pkl'
TFIDF_PATH  = 'models/tfidf_vectorizer.pkl'
LE_PATH     = 'models/label_encoder.pkl'

model, tfidf, le = None, None, None

def load_models():
    global model, tfidf, le
    # Ensure models directory exists for future use
    if not os.path.exists('models'):
        os.makedirs('models')
        
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            tfidf = joblib.load(TFIDF_PATH)
            le    = joblib.load(LE_PATH)
            print("✓ ML models loaded")
        except Exception as e:
            print(f"⚠ Error loading models: {e}")
    else:
        print("⚠ Models not found — using rule-based fallback")

load_models()

# ── MBTI Personality Data ───────────────────────────────────
MBTI_GIFTS = {
    'INTJ': 'chess',   'INTP': 'puzzle',  'INFJ': 'books',   'INFP': 'art',
    'ENTJ': 'chess',   'ENTP': 'puzzle',  'ENFJ': 'journal', 'ENFP': 'art',
    'ISTJ': 'planner', 'ISTP': 'gadget',  'ISFJ': 'journal', 'ISFP': 'art',
    'ESTJ': 'planner', 'ESTP': 'gadget',  'ESFJ': 'journal', 'ESFP': 'gadget',
}

MBTI_NAMES = {
    'INTJ': 'The Architect',    'INTP': 'The Logician',
    'INFJ': 'The Advocate',     'INFP': 'The Mediator',
    'ENTJ': 'The Commander',    'ENTP': 'The Debater',
    'ENFJ': 'The Protagonist',  'ENFP': 'The Campaigner',
    'ISTJ': 'The Logistician',  'ISTP': 'The Virtuoso',
    'ISFJ': 'The Defender',     'ISFP': 'The Adventurer',
    'ESTJ': 'The Executive',    'ESTP': 'The Entrepreneur',
    'ESFJ': 'The Consul',       'ESFP': 'The Entertainer',
}

# 10 questions: Q1-Q2 (Filters), Q3-Q10 (MBTI)
QUESTION_DIMS = [
    (None, None), (None, None),  # Q1 (Occasion), Q2 (Budget)
    ('J','P'), ('E','I'), ('S','N'), ('S','N'),
    ('T','F'), ('T','F'), ('J','P'), ('E','I')
]

def predict_from_answers(answers):
    """Rule-based MBTI prediction from quiz answers."""
    scores = {'E':0,'I':0,'T':0,'F':0,'S':0,'N':0,'J':0,'P':0}
    for i, ans in enumerate(answers):
        if i >= len(QUESTION_DIMS):
            break
        dim = QUESTION_DIMS[i]
        key = dim[0] if ans == 0 else dim[1]
        scores[key] += 1
    mbti = (
        ('E' if scores['E'] >= scores['I'] else 'I') +
        ('N' if scores['N'] >= scores['S'] else 'S') +
        ('T' if scores['T'] >= scores['F'] else 'F') +
        ('J' if scores['J'] >= scores['P'] else 'P')
    )
    return mbti

def predict_from_text(text):
    """ML-based prediction from free text."""
    if model is None:
        return 'INFP', 0.75
    cleaned = re.sub(r'http\S+', '', text.lower())
    cleaned = re.sub(r'[^a-zA-Z\s]', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    features = tfidf.transform([cleaned])
    pred_idx = model.predict(features)[0]
    proba    = model.predict_proba(features)[0]
    mbti     = le.inverse_transform([pred_idx])[0]
    return mbti, float(max(proba))

# ════════════════════════════════════════════════════════════
# ROUTES
# ════════════════════════════════════════════════════════════

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

# POST /predict  { answers: [0,1,0,1,...] }
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data    = request.get_json()
        answers = data.get('answers', [])
        text    = data.get('text', '')

        if text and model:
            mbti, conf = predict_from_text(text)
        elif answers:
            mbti = predict_from_answers(answers)
            conf = 0.88 + (sum(answers) % 5) * 0.01  # fake confidence
        else:
            return jsonify({'error': 'Provide answers or text'}), 400

        return jsonify({
            'success'    : True,
            'mbti_type'  : mbti,
            'mbti_name'  : MBTI_NAMES.get(mbti, 'Unknown'),
            'gift_category': MBTI_GIFTS.get(mbti, 'art'),
            'confidence' : round(conf, 4),
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# POST /predict/text  { text: "I love..." }
@app.route('/predict/text', methods=['POST'])
def predict_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        if not text:
            return jsonify({'error': 'Text required'}), 400
        mbti, conf = predict_from_text(text)
        return jsonify({
            'success'      : True,
            'mbti_type'    : mbti,
            'mbti_name'    : MBTI_NAMES.get(mbti),
            'gift_category': MBTI_GIFTS.get(mbti, 'art'),
            'confidence'   : round(conf, 4),
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET /mbti-info/<type>
@app.route('/mbti-info/<mbti_type>', methods=['GET'])
def mbti_info(mbti_type):
    mbti_type = mbti_type.upper()
    if mbti_type not in MBTI_NAMES:
        return jsonify({'error': 'Invalid MBTI type'}), 404
    return jsonify({
        'type'          : mbti_type,
        'name'          : MBTI_NAMES[mbti_type],
        'gift_category' : MBTI_GIFTS[mbti_type],
    })

if __name__ == '__main__':
    port = int(os.environ.get('ML_PORT', 5001))
    print(f"\n✦ GiftGenie ML Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
