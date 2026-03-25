import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os
import re

# Use absolute paths or paths relative to the script
base_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(base_dir, 'mbti_extracted/mbti_1.csv')
model_save_path = os.path.join(base_dir, 'mbti_model.joblib')

if not os.path.exists(dataset_path):
    print(f"Error: Dataset not found at {dataset_path}")
    # Fallback to current dir check
    dataset_path = os.path.join(base_dir, 'mbti_1.csv')
    if not os.path.exists(dataset_path):
        print("Dataset still not found. Skipping training.")
        exit(1)

print(f"Loading dataset from {dataset_path}...")
df = pd.read_csv(dataset_path)

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

print("Cleaning data...")
df['posts'] = df['posts'].apply(clean_text)

X = df['posts']
y = df['type']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training model (TF-IDF + Logistic Regression)...")
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
    ('clf', LogisticRegression(max_iter=1000, multi_class='ovr'))
])

pipeline.fit(X_train, y_train)

score = pipeline.score(X_test, y_test)
print(f"Model accuracy: {score:.2f}")

print(f"Saving model to {model_save_path}...")
joblib.dump(pipeline, model_save_path)
print("Done!")
