dev:
	PORT=8333 CLIENT_ORIGIN=http://localhost:8080 DB_NAME=db.local.json node ./src/server.mjs
static:
	cd ~/projects/duelma/card-storage
	make start
