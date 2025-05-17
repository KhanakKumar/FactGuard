from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from claim_extract import extract_claim_sentences
import veracity
import preprocessing  # Your preprocessing script
import fact_check      # Your fact-checking module
import Scraping

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Updated model to accept both article and source
class ExtractRequest(BaseModel):
    text1: str  # The article
    text2: str  # The source

@app.post("/preprocess")
async def process_article_and_check_source(request: ExtractRequest):
    """Processes the article, runs fact-checks, and evaluates the source."""
    try:
        print(f"🔹 Received text1 (Article): {request.text1[:100]}...")  # Print first 100 chars
        print(f"🔹 Received text2 (Source): {request.text2}")

        # Step 1: Preprocess article
        processed_data = preprocessing.main(request.text1)
        summarized_text = processed_data["summarized_text"]

        # Step 2: Extract claims
        extracted_claims = extract_claim_sentences(summarized_text)
        print(f"🧠 Extracted Claims: {extracted_claims}")

        # Step 3: Run fact-checking functions on the article
        claims_with_veracity = []
        for claim in extracted_claims:
            result = fact_check.check_claim_veracity(claim)
            claims_with_veracity.append({
                "claim": claim,
                "veracity": result["veracity"],
                "confidence": result["confidence"]
            })
        article_veracity = veracity.calculate_article_veracity(claims_with_veracity)
        political_bias_result = fact_check.detect_political_bias(summarized_text)

        # Step 4: Evaluate source reliability
        source_reliability = fact_check.get_reliability_score(request.text2)
        r_f = Scraping.flag_article_veracity(extracted_claims)

        print(f"✅ Claim Veracity: {article_veracity}")
        print(f"✅ Political Bias: {political_bias_result}")
        print(f"✅ Source Reliability: {source_reliability}")

        return {
            "lemmatized_text": processed_data["lemmatized_text"],
            "summarized_text": summarized_text,
            "veracity_result": r_f,
            "political_bias_result": political_bias_result,
            "source_reliability": source_reliability
        }

    except Exception as e:
        print(f"❌ Error in FastAPI: {e}")
        return {"error": str(e)}

# Run the API with: uvicorn main:app --host 0.0.0.0 --port 5005 --reload
#  .\myenv\Scripts\Activate.ps1