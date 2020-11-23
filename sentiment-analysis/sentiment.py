import os
import sys
import pickle

_DIR = os.path.dirname(os.path.abspath(__file__))

with open(f'{_DIR}/model/model.pkl', 'rb') as f:
    _MODEL = pickle.load(f)

with open(f'{_DIR}/model/vectorizer.pkl', 'rb') as f:
    _VECTORIZER = pickle.load(f)


def predict(text: str):
    vectors = _VECTORIZER.transform([text])
    return _MODEL.predict(vectors)[0]


if __name__ == "__main__":
    print(predict(sys.argv[-1]))
