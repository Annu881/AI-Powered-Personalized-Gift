import pandas as pd
import numpy as np
import re
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

# --- COLAB SETUP ---
# If using Google Colab, uncomment the following to mount your drive:
# from google.colab import drive
# drive.mount('/content/drive')
# DATASET_PATH = '/content/drive/MyDrive/mbti_1.csv' 

# Default local path for testing
DATASET_PATH = '../backend/ml/mbti_1.csv' 

def clean_text(text):
    """
    Advanced text cleaning: 
    - Lowercase
    - Remove URLs
    - Remove special characters and numbers
    - Strip whitespace
    """
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text) # Remove URLs
    text = re.sub(r'[^a-zA-Z\s]', '', text)           # Remove non-alphabetic
    text = re.sub(r'\s+', ' ', text).strip()          # Remove extra whitespace
    return text

def train_mbti_model(data_path):
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}. Please check the path.")
        return

    print("Step 1: Loading Dataset...")
    df = pd.read_csv(data_path)
    
    print(f"Dataset Shape: {df.shape}")
    print(df.head())

    print("\nStep 2: Cleaning Text Data (this may take a minute)...")
    df['posts'] = df['posts'].apply(clean_text)

    print("\nStep 3: Splitting Data into Train/Test sets...")
    X = df['posts']
    y = df['type']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("\nStep 4: Building Pipeline (TF-IDF + Logistic Regression)...")
    # Using 5000 max features for a balance between speed and accuracy
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))),
        ('clf', LogisticRegression(max_iter=2000, multi_class='multinomial', solver='lbfgs', C=1.0))
    ])

    print("Step 5: Training Model...")
    pipeline.fit(X_train, y_train)

    print("\nStep 6: Evaluating Model...")
    y_pred = pipeline.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    print("\nStep 7: Saving Model...")
    model_filename = 'mbti_model_improved.joblib'
    joblib.dump(pipeline, model_filename)
    print(f"Model saved successfully as: {model_filename}")

if __name__ == "__main__":
    train_mbti_model(DATASET_PATH)
