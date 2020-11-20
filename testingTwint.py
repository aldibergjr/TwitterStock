import twint

# Configure
c = twint.Config()
c.Username = "realDonaldTrump"
c.Search = "count"

# Run
twint.run.Search(c)