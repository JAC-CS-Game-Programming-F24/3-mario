import Sprite from '../../lib/Sprite.js';
import ImageName from '../enums/ImageName.js';
import Layer from './Layer.js';
import { images } from '../globals.js';

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
	}

	render() {
		this.foregroundLayer.render();
	}

	getTileAt(layerIndex, col, row) {
		return this.layers[layerIndex].getTile(col, row);
	}
}
