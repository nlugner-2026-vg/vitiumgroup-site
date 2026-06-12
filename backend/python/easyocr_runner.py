import easyocr
import json
import sys

reader = easyocr.Reader(['en'], gpu=False)

def run_ocr(image_path):
    result = reader.readtext(image_path, detail=1)
    words = []
    confidences = []

    for box, text, conf in result:
        words.append(text)
        confidences.append(conf)

    avg_conf = sum(confidences) / len(confidences) if confidences else 0

    output = {
        "engine": "easyocr",
        "text": " ".join(words),
        "confidence": avg_conf
    }

    print(json.dumps(output))

if __name__ == "__main__":
    run_ocr(sys.argv[1])
