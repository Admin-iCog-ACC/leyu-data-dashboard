import pandas as pd
from transformers import AutoTokenizer

TOKENIZER = AutoTokenizer.from_pretrained("Hailay/geez-tokenizer")

def count_tokens_for_text(text):
    try:
        if pd.isna(text) or text == "":
            return 0
        token_ids = TOKENIZER.encode(str(text))
        return len(token_ids)
    except Exception:
        return 0
