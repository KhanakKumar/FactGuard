import requests
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util

# NewsAPI URL and your API key (replace with your own key)
NEWSAPI_URL = "https://newsapi.org/v2/everything"
API_KEY = "00920b8f414d4bfaa4f15baaa23044f4"  # Replace with your NewsAPI key

# Initialize claim extraction model
claim_extractor = pipeline(
    "summarization",
    model="Babelscape/t5-base-summarization-claim-extractor"
)

# Load the Sentence-BERT model for semantic comparison
model = SentenceTransformer('all-MiniLM-L6-v2')  # You can use different models, this one is lightweight

def get_news_articles(query):
    """
    Use NewsAPI to search for similar news articles based on the query (claim).
    """
    params = {
        'q': query,  # Search query (claim text)
        'apiKey': API_KEY,  # Your NewsAPI key
        'language': 'en',  # Only get English articles
        'sortBy': 'relevancy',  # Sort by relevancy
        'pageSize': 5  # Get top 5 most relevant articles
    }

    response = requests.get(NEWSAPI_URL, params=params)
    articles = response.json().get('articles', [])
    return articles

def extract_claims_from_article(article_text):
    """
    Extract claims from an article using the claim extractor model.
    """
    result = claim_extractor(article_text, max_length=60, min_length=5, do_sample=False)
    if isinstance(result, list) and 'summary_text' in result[0]:
        raw_output = result[0]['summary_text']
        claims = [c.strip() for c in raw_output.split('\n') if c.strip()]
        return claims
    return []

def compare_claims(original_claims, cross_referenced_claims, threshold=0.7):
    """
    Compare original claims with claims extracted from cross-referenced news articles using semantic similarity.
    Flag as True if most claims align, False if most contradict.
    """
    similar_count = 0
    contradict_count = 0

    # Convert claims into embeddings
    original_embeddings = model.encode(original_claims, convert_to_tensor=True)
    cross_referenced_embeddings = model.encode(cross_referenced_claims, convert_to_tensor=True)

    for orig_emb in original_embeddings:
        for cross_emb in cross_referenced_embeddings:
            # Compute cosine similarity between original claim and cross-referenced claim
            similarity_score = util.pytorch_cos_sim(orig_emb, cross_emb).item()

            if similarity_score >= threshold:
                similar_count += 1
            else:
                contradict_count += 1

    # If the majority of claims are similar, flag the article as True, else False
    if similar_count >= contradict_count:
        return "True"
    else:
        return "False"

def flag_article_veracity(claims):
    """
    Flag the veracity of the article based on claims and cross-referencing with news.
    """
    # Store the final result for flagging
    overall_veracity = []

    for claim in claims:
        # Step 1: Find similar articles using NewsAPI
        articles = get_news_articles(claim)

        # Step 2: Extract claims from the fetched articles
        cross_referenced_claims = []
        for article in articles:
            article_text = article['content'] if article['content'] else article['description']
            cross_referenced_claims.extend(extract_claims_from_article(article_text))

        # Step 3: Compare original claim with claims from cross-referenced articles
        result = compare_claims([claim], cross_referenced_claims)

        # Step 4: Append result for this claim to overall veracity list
        overall_veracity.append(result)

    # Step 5: Return overall veracity of the article (if majority of claims are true, flag as True)
    if overall_veracity.count("True") > overall_veracity.count("False"):
        return "True"
    else:
        return "False"

