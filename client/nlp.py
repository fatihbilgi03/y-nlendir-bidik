# client/nlp.py
def extract_keywords(text):
    # Basit bir örnek: en uzun üç kelimeyi al
    words = sorted(text.split(), key=len, reverse=True)
    return words[:3]
