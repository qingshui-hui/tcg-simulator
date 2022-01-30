dev:
	PORT=8333 CLIENT_ORIGIN=http://localhost:8080 DB_NAME=db.local.json DECK_URL='https://storage.googleapis.com/card-storage/decks.json' node ./src/server.js
static:
	cd ~/projects/duelma/card-storage && make start
start:
	DB_NAME=db.local.json node ./src/server.js

sample:
	PORT=8333 CLIENT_ORIGIN=http://localhost:8080 DB_NAME=db.local.json SAMPLE_MODE=true node ./src/server.js
