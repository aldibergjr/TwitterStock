import twint
import pandas as pd
import json


# Configure
c = twint.Config()
c.Search = "$TSLA"
c.Limit = 0
c.Pandas = True
c.Hide_output = True


# Run
twint.run.Search(c)

Tweets_df =  twint.storage.panda.Tweets_df.head()
result = Tweets_df.to_json(orient="records")
parsed = json.loads(result)
  
f = open("D:/documents/TwitterStock/twitterstock-app/src/output.json", "w")
f.write(json.dumps(parsed, indent=4))
f.close()
