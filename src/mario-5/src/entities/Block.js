import Entity from './Entity.js';
import Sprite from '../../lib/Sprite.js';
import { objectSpriteConfig } from '../../config/SpriteConfig.js';
import Tile from '../services/Tile.js';
import { timer } from '../globals.js';
import Easing from '../../lib/Easing.js';

export default class Block extends Entity {
	constructor(x, y, spriteSheet) {
		super(x, y, Tile.SIZE, Tile.SIZE);

		this.spriteSheet = spriteSheet;
		this.sprites = objectSpriteConfig.block.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
		this.currentSprite = this.sprites[0];
		this.isHit = false;
	}

	render() {
		this.currentSprite.render(this.position.x, this.position.y);
	}

	async hit() {
		if (!this.isHit) {
			this.isHit = true;

			await timer.tweenAsync(
				this.position,
				{ y: this.position.y - 5 },
				0.1,
				Easing.easeInOutQuad
			);
			await timer.tweenAsync(
				this.position,
				{ y: this.position.y + 5 },
				0.1,
				Easing.easeInOutQuad
			);

			this.currentSprite = this.sprites[1];

			return true;
		}

		return false;
	}
}
