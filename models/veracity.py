def calculate_article_veracity(claims_with_veracity):
    # Veracity to numeric mapping
    veracity_map = {
        "true": 1,
        "mostly-true": 0.9,
        "half-true": 0.5,
        "barely-true": 0.2,
        "false": 0,
        "pants-fire": -1
    }

    # Initialize variables for weighted sum and total confidence
    weighted_sum = 0
    total_confidence = 0

    for claim in claims_with_veracity:
        veracity_label = claim["veracity"]
        confidence = claim["confidence"]
        
        # Get the numeric score for the veracity label
        veracity_score = veracity_map.get(veracity_label, 0)  # Default to 0 if not found

        # Weighted sum of the veracity score by confidence
        weighted_sum += veracity_score * confidence
        total_confidence += confidence

    # Calculate the final score for the article (mean of weighted scores)
    if total_confidence > 0:
        article_score = weighted_sum / total_confidence  # Normalized by confidence
    else:
        article_score = 0  # In case there were no claims or no confidence scores
    
    return article_score
