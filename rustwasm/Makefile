INCLUDES=-Isrc/duktape
CFLAGS=-mmacosx-version-min=10.12 -x objective-c
LDFLAGS=-fobjc-link-runtime -lm $(FRAMEWORKS)
DUKCFLAGS=-DDUK_USE_DEBUG -DDUK_USE_DEBUG_LEVEL=0

pack:
	@wasm-pack build

init:
	@npm init wasm-app www
	cd www; npm install

serve:
	cd www; npm run start
