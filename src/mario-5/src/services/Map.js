import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';
import Tile from './Tile.js';
import Layer from './Layer.js';
import { images } from '../globals.js';
import Block from '../entities/Block.js';

export default class Map {
	static FOREGROUND_LAYER = 0;

	constructor(mapDefinition) {
		this.width = mapDefinition.width;
		this.height = mapDefinition.height;
		this.tileSize = mapDefinition.tilewidth;
		this.tilesets = mapDefinition.tilesets;

		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			this.tileSize,
			this.tileSize
		);

		this.layers = mapDefinition.layers.map(
			(layerData) => new Layer(layerData, sprites)
		);
		this.foregroundLayer = this.layers[Map.FOREGROUND_LAYER];

		this.blocks = [];

		this.initializeSpecialTiles();
	}

	initializeSpecialTiles() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const tileId = this.foregroundLayer.getTile(x, y)?.id;

				if (tileId === Tile.BLOCK) {
					this.blocks.push(
						new Block(
							x * this.tileSize,
							y * this.tileSize,
							images.get(ImageName.Tiles)
						)
					);
					this.foregroundLayer.setTileId(x, y, Tile.BLANK); // Replace the block from the tilemap
				}
			}
		}
	}

	update(dt) {
		this.blocks.forEach((block) => block.update(dt));
	}

	render(context) {
		this.foregroundLayer.render();
		this.blocks.forEach((block) => block.render(context));
		this.renderGrid(context);
	}

	getBlockAt(x, y) {
		return this.blocks.find(
			(block) =>
				x >= block.position.x &&
				x < block.position.x + block.dimensions.x &&
				y >= block.position.y &&
				y < block.position.y + block.dimensions.y
		);
	}

	getTileAt(layerIndex, col, row) {
		return this.layers[layerIndex].getTile(col, row);
	}

	isSolidTileAt(col, row) {
		const tile = this.foregroundLayer.getTile(col, row);
		return tile !== null && tile.id !== -1;
	}

	renderGrid(context) {
		context.save();
		context.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // White with transparency
		context.lineWidth = 0.5;

		// Vertical lines
		for (let x = 0; x <= this.width; x++) {
			context.beginPath();
			context.moveTo(x * this.tileSize, 0);
			context.lineTo(x * this.tileSize, this.height * this.tileSize);
			context.stroke();
		}

		// Horizontal lines
		for (let y = 0; y <= this.height; y++) {
			context.beginPath();
			context.moveTo(0, y * this.tileSize);
			context.lineTo(this.width * this.tileSize, y * this.tileSize);
			context.stroke();
		}

		context.restore();
	}
}
