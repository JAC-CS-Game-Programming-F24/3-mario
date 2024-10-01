export default class Tile {
	static SIZE = 16;
	static BLOCK = 21;
	static BLANK = 17;

	constructor(id, sprites) {
		this.sprites = sprites;
		this.id = id;
	}

	render(x, y) {
		this.sprites[this.id].render(x * Tile.SIZE, y * Tile.SIZE);
	}
}
