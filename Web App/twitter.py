# author = rhnvrm <hello@rohanverma.net>

import os
import re
import tweepy
import pickle
from tweepy import OAuthHandler

vectorizer = pickle.load(open('vectorizer.sav', 'rb'))
classifier = pickle.load(open('classifier.sav', 'rb'))

class TwitterClient(object):
    '''
    Generic Twitter Class for the App
    '''
    def __init__(self, query, retweets_only=False, with_sentiment=False):
        # keys and tokens from the Twitter Dev Console
        consumer_key = 'qkyZCE6zSkTSpGVDhQj1LBZSU'
        consumer_secret = 'hKwUa2kyWb0AeobQMuAPTzeBBxWHPP6SDJ4WACxlyweapsHyMu'
        access_token = '1014634292960362497-eqW1Cxg2e0AmKlE1z6goqdskXSJd9o'
        access_token_secret = 'OLLX29LAlxeT8r2Yg59WN1jfk6tLHN0mwpL1Bwh8qZ6gb'
        # Attempt authentication
        try:
            self.auth = OAuthHandler(consumer_key, consumer_secret)
            self.auth.set_access_token(access_token, access_token_secret)
            self.query = query
            self.retweets_only = retweets_only
            self.with_sentiment = with_sentiment
            self.api = tweepy.API(self.auth)
            self.tweet_count_max = 100  # To prevent Rate Limiting
        except:
            print("Error: Authentication Failed")

    def set_query(self, query=''):
        self.query = query

    def set_retweet_checking(self, retweets_only='false'):
        self.retweets_only = retweets_only

    def set_with_sentiment(self, with_sentiment='false'):
        self.with_sentiment = with_sentiment

    def clean_tweet(self, tweet):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())

    def get_tweet_sentiment(self, tweet):
        text_vector = vectorizer.transform([self.clean_tweet(tweet)])
        result = classifier.predict(text_vector)
        if result == 1:
            return 'positive'
        elif result == 0:
            return 'neutral'
        else:
            return 'negative'
    
    def get_tweets(self):
        tweets = []

        try:
            recd_tweets = self.api.search_tweets(q=self.query, lang="id",
                                          count=self.tweet_count_max)
            if not recd_tweets:
                pass
            for tweet in recd_tweets:
                parsed_tweet = {}

                parsed_tweet['text'] = tweet.text
                parsed_tweet['user'] = tweet.user.screen_name
                
                if self.with_sentiment == 1:
                    parsed_tweet['sentiment'] = self.get_tweet_sentiment(tweet.text)
                else:
                    parsed_tweet['sentiment'] = 'unavailable'

                if tweet.retweet_count > 0 and self.retweets_only == 1:
                    if parsed_tweet not in tweets:
                        tweets.append(parsed_tweet)
                elif not self.retweets_only:
                    if parsed_tweet not in tweets:
                        tweets.append(parsed_tweet)

            return tweets

        except AttributeError as e:
            print("Error : " + str(e))
