import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(base_dir, 'mbti_extracted/mbti_1.csv')
if not os.path.exists(dataset_path):
    dataset_path = os.path.join(base_dir, 'mbti_1.csv')

print("Creating Fast Model (Draft)...")
# Load small subset for speed
df = pd.read_csv(dataset_path, nrows=1000)

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=2000, stop_words='english')),
    ('clf', LogisticRegression(max_iter=1000))
])

pipeline.fit(df['posts'], df['type'])

model_path = os.path.join(base_dir, 'mbti_model.joblib')
joblib.dump(pipeline, model_path)
print(f"Fast Model saved to {model_path}")
