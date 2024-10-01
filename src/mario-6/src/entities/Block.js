import Entity from './Entity.js';
import Sprite from '../../lib/Sprite.js';
import { objectSpriteConfig } from '../../config/SpriteConfig.js';
import Tile from '../services/Tile.js';
import { sounds, timer } from '../globals.js';
import Easing from '../../lib/Easing.js';
import Graphic from '../../lib/Graphic.js';
import SoundName from '../enums/SoundName.js';

/**
 * Represents a block in the game world.
 * @extends Entity
 */
export default class Block extends Entity {
	/**
	 * @param {number} x - The x-coordinate of the block.
	 * @param {number} y - The y-coordinate of the block.
	 * @param {Graphic} spriteSheet - The sprite sheet for the block.
	 */
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

	/**
	 * Renders the block.
	 */
	render() {
		this.currentSprite.render(this.position.x, this.position.y);
	}

	/**
	 * Handles the block being hit.
	 * @returns {Promise<boolean>} A promise that resolves to true if the block was hit, false otherwise.
	 */
	async hit() {
		if (!this.isHit) {
			this.isHit = true;
			sounds.play(SoundName.Bump);

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
