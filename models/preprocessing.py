import sys
import json
import spacy
from transformers import pipeline, AutoTokenizer

# Load models globally for performance
nlp = spacy.load("en_core_web_sm")
summarizer = pipeline("summarization", model="t5-small")
tokenizer = AutoTokenizer.from_pretrained("t5-small")

def preprocess(text):
    """Lemmatize the input text."""
    doc = nlp(text)
    lemmatized_text = " ".join([token.lemma_ for token in doc])
    return lemmatized_text

def truncate_to_token_limit(text, max_tokens=512):
    """Ensure input to summarizer stays within token limit."""
    tokens = tokenizer.tokenize(text)
    if len(tokens) <= max_tokens:
        return text
    truncated_tokens = tokens[:max_tokens]
    truncated_text = tokenizer.convert_tokens_to_string(truncated_tokens)
    return truncated_text

def summarize(text):
    """Summarize text using T5-small model."""
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]["summary_text"]

def main(text):
    """Main function to preprocess and summarize."""
    lemmatized_text = preprocess(text)
    limited_text = truncate_to_token_limit(lemmatized_text, max_tokens=512)
    summarized_text = summarize(limited_text)
    return {
        "lemmatized_text": lemmatized_text,
        "summarized_text": summarized_text
    }

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        text = data["text"]
        result = main(text)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
