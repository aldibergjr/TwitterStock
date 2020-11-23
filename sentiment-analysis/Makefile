build-dev:
	@docker build -t sentiment .

run-dev:
	@docker run -it --net=host sentiment 

build-heroku:
	@heroku container:push web --app twitter-sentiment-1015

deploy-heroku:
	@heroku container:release web --app twitter-sentiment-1015