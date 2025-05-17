from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

# Define model name
mnli_model_name = "roberta-large-mnli"
mnli_tokenizer = AutoTokenizer.from_pretrained(mnli_model_name)
num_labels = 6 
mnli_model = AutoModelForSequenceClassification.from_pretrained(mnli_model_name, num_labels=num_labels, ignore_mismatched_sizes = True)
mnli_model.load_state_dict(torch.load("model_cpu.pth", map_location=torch.device("cpu")))
mnli_model.to("cpu")
mnli_model.eval()

device = torch.device("cpu")
# Load fine-tuned RoBERTa-Pol for political bias detection
model = AutoModelForSequenceClassification.from_pretrained("political_bias_model")
tokenizer = AutoTokenizer.from_pretrained("political_bias_model")

def check_claim_veracity(text):
    inputs = mnli_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = mnli_model(**inputs)
    logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    
    labels = ["true", "mostly-true", "half-true", "barely-true", "false", "pants-fire"]
    max_index = torch.argmax(probabilities, dim=-1).item()

    # Get the label with the highest probability
    most_likely_label = labels[max_index]
    confidence_score = probabilities[0][max_index].item()

    return {
        "veracity": most_likely_label,
        "confidence": round(confidence_score, 4)  # Rounded to 4 decimal places
    }

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Define the prediction function
def detect_political_bias(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
    
    logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)

    labels = ["left", "center", "right"]
    result = {labels[i]: probabilities[0][i].item() for i in range(len(labels))}
    
    print("Logits:", logits)
    return result

import pandas as pd

def get_reliability_score(source_name, csv_path="data2 - Sheet1 (1).csv"):
    # Load the CSV file
    df = pd.read_csv(csv_path)
    
    # Check if the source exists in the CSV
    if source_name in df["Channels"].values:
        score = df.loc[df["Channels"] == source_name, "Reliability"].values[0]
        return f"Reliability Score of {source_name}: {score}"
    else:
        return "Cannot find source"



