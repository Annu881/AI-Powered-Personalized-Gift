import joblib
import pandas as pd
import sys
import os
import re

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'mbti_model.joblib')

if not os.path.exists(model_path):
    print("Model not found. Please run train.py first.")
    sys.exit(1)

pipeline = joblib.load(model_path)

def clean_text(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

def predict_type(posts):
    # 'posts' should be a single string of combined responses
    cleaned = [clean_text(posts)]
    prediction = pipeline.predict(cleaned)
    return prediction[0]

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = " ".join(sys.argv[1:])
        print(predict_type(input_text))
    else:
        print("Usage: python predict.py <quiz_text>")
