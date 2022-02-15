dev:
	PORT=8333 CLIENT_ORIGIN=http://localhost:8080 DECK_URL='https://storage.googleapis.com/card-storage/decks.json' node ./src/server.js
static:
	cd ~/projects/duelma/card-storage && make start
start:
	node ./src/server.js

sample:
	PORT=8333 CLIENT_ORIGIN=http://localhost:8080 SAMPLE_MODE=true node ./src/server.js
