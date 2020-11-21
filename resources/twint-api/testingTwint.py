import twint
import pandas as pd
import json


# Configure
c = twint.Config()
c.Username = "realDonaldTrump"
c.Search = "count"
c.Pandas = True
c.Hide_output = True


# Run


twint.run.Search(c)


'''
Tweets_df =  twint.storage.panda.Tweets_df
result = Tweets_df.to_json(orient="records")
parsed = json.loads(result)
  
print(parsed)
'''