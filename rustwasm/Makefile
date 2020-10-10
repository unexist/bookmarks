bootstrap:
	cargo install cargo-generate
	cargo install wasm-pack
	npm init wasm-app

pack:
	@wasm-pack build

init:
	@npm init wasm-app www
	cd www; npm install

serve:
	cd www; npm run start
