import sys
import pickle

with open('model/model.pkl', 'rb') as f:
    _MODEL = pickle.load(f)

with open('model/vectorizer.pkl', 'rb') as f:
    _VECTORIZER = pickle.load(f)


def predict(text: str):
    vectors = _VECTORIZER.transform([text])
    return _MODEL.predict(vectors)[0]
