# Tweet Sentiment Labeller

Lightweight toolkit to collect Indonesian tweets, clean and label them, train a classifier, and run a simple web app for sentiment predictions.

This repository contains:
- `Data Processing/` — notebooks and helpers to scrape, clean, and label tweets; training notebooks produce `vectorizer.sav` and `classifier.sav`.
- `Web App/` — a Flask app that loads the trained model and vectorizer to provide sentiment predictions.

## Quick Overview
- Collect tweets using either the Twitter API v2 (recommended).
- Clean and preprocess with the provided notebooks.
- Train a classifier (SVM) and export `vectorizer.sav` and `classifier.sav` to the `Web App/` folder.
- Run the web app to classify new tweets.

## Requirements
- Python 3.11+.
- Install project dependencies when working in the `Web App/` folder:

```powershell
python -m venv venv
# Windows
venv\Scripts\Activate.ps1
# Linux/macOS
source venv/bin/activate
pip install --upgrade pip
pip install -r "Web App/requirement.txt"
```

For data processing notebooks, install:
```powershell
pip install requests pandas python-dotenv beautifulsoup4 scikit-learn
```

## Data collection

Twitter API v2 (recommended): use `search_tweets_v2(query, count, lang='id')`.
	- Get a bearer token from https://developer.twitter.com/, then set `TWITTER_BEARER_TOKEN` in your environment or a `.env` file in the project root.
	- Example (in a notebook cell):
		```python
		df = search_tweets_v2('indonesia -is:retweet', 1000, lang='id')
		```

Notes:
- Always respect Twitter's Terms of Service when collecting data.
- Use language filters (e.g., `lang:id`) to restrict to Indonesian tweets.

## Preprocessing & Training

1. Clean scraped CSVs using `Tweets_Cleaning_Indonesia.ipynb` (standard cleaning and tokenization steps are provided).
2. Train the SVM model using `Prediction Using SVM.ipynb`. The notebook saves `vectorizer.sav` and `classifier.sav` into the `Web App/` folder so the web app can load them.

## Run the Web App
1. Activate the virtual environment in `Web App/`.
2. Ensure `vectorizer.sav` and `classifier.sav` exist in the `Web App/` folder.
3. Start the server:

```powershell
python app.py
```

Open `http://127.0.0.1:80` in your browser.

## Environment files and security
- Add sensitive keys to a `.env` file (project root). This repository now includes `.gitignore` with `.env` so keys are not committed.
- Example `.env` entries:
```
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
```
