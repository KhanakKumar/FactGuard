import spacy
from transformers import pipeline

# Load spaCy for optional sentence splitting
nlp = spacy.load("en_core_web_sm")

# Load Babelscape's claim extraction model (summarization-based)
claim_extractor = pipeline(
    "summarization",
    model="Babelscape/t5-base-summarization-claim-extractor"
)

def extract_claim_sentences(article_text):
    """
    Extracts multiple distinct claims from the input article using chunking and the Babelscape model.
    """
    try:
        # Split the article into 300-character chunks for better claim extraction
        chunk_size = 300
        chunks = [article_text[i:i+chunk_size] for i in range(0, len(article_text), chunk_size)]

        all_claims = []

        for idx, chunk in enumerate(chunks):
            result = claim_extractor(chunk, max_length=80, min_length=5, do_sample=False)

            if isinstance(result, list) and 'summary_text' in result[0]:
                raw_output = result[0]['summary_text']
                print(f"📦 Chunk {idx+1} Output: {raw_output}")

                # Split into individual claims using both newlines and periods
                claims = [c.strip() for c in raw_output.replace("\n", ".").split('.') if c.strip()]
                all_claims.extend(claims)

        return all_claims

    except Exception as e:
        print(f"❌ Error during claim extraction: {e}")
        return []
