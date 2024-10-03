import Input from '../../../lib/Input.js';
import State from '../../../lib/State.js';
import { PlayerConfig } from '../../../config/PlayerConfig.js';
import { input } from '../../globals.js';
import Tile from '../../services/Tile.js';
import CollisionDetector from '../../services/CollisionDetector.js';

export default class PlayerState extends State {
	constructor(player) {
		super();
		this.player = player;
		this.collisionDetector = new CollisionDetector(player.map);
	}

	update(dt) {
		this.applyGravity(dt);
		this.updatePosition(dt);

		this.player.currentAnimation.update(dt);
	}

	render(context) {
		super.render();

		context.save();

		// Flip the sprite if facing left
		if (this.player.facingRight) {
			context.scale(-1, 1);
			context.translate(
				Math.floor(-this.player.position.x - this.player.dimensions.x),
				Math.floor(this.player.position.y)
			);
		} else {
			context.translate(
				Math.floor(this.player.position.x),
				Math.floor(this.player.position.y)
			);
		}

		this.player.currentAnimation.getCurrentFrame().render(0, 0);

		context.restore();
		this.renderDebug(context);
	}

	renderDebug(context) {
		// Calculate the range of tiles to check
		const left = Math.floor(this.player.position.x / Tile.SIZE) - 1;
		const top = Math.floor(this.player.position.y / Tile.SIZE) - 1;
		const right =
			Math.floor(
				(this.player.position.x + this.player.dimensions.x) / Tile.SIZE
			) + 1;
		const bottom =
			Math.floor(
				(this.player.position.y + this.player.dimensions.y - 1) /
					Tile.SIZE
			) + 1;

		// Render potentially colliding tiles
		context.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow with transparency
		for (let y = top; y <= bottom; y++) {
			for (let x = left; x <= right; x++) {
				context.fillRect(
					x * Tile.SIZE,
					y * Tile.SIZE,
					Tile.SIZE,
					Tile.SIZE
				);
			}
		}

		// Render actually colliding tiles
		context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red with transparency
		this.getCollidingTiles(left, top, right, bottom).forEach((tile) => {
			context.fillRect(
				tile.x * Tile.SIZE,
				tile.y * Tile.SIZE,
				Tile.SIZE,
				Tile.SIZE
			);
		});

		// Render player hitbox
		context.strokeStyle = 'blue';
		context.strokeRect(
			this.player.position.x,
			this.player.position.y,
			this.player.dimensions.x,
			this.player.dimensions.y
		);
	}

	getCollidingTiles(left, top, right, bottom) {
		const collidingTiles = [];

		for (let y = top; y <= bottom; y++) {
			for (let x = left; x <= right; x++) {
				if (this.player.map.isSolidTileAt(x, y)) {
					collidingTiles.push({ x, y });
				}
			}
		}

		return collidingTiles;
	}

	handleHorizontalMovement() {
		if (input.isKeyHeld(Input.KEYS.A) && input.isKeyHeld(Input.KEYS.D)) {
			this.slowDown();
		} else if (input.isKeyHeld(Input.KEYS.A)) {
			this.moveLeft();
			this.player.facingRight = false;
		} else if (input.isKeyHeld(Input.KEYS.D)) {
			this.moveRight();
			this.player.facingRight = true;
		} else {
			this.slowDown();
		}

		// Set speed to zero if it's close to zero to stop the player
		if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
	}

	moveRight() {
		this.player.velocity.x = Math.min(
			this.player.velocity.x + PlayerConfig.acceleration,
			PlayerConfig.maxSpeed
		);
	}

	moveLeft() {
		this.player.velocity.x = Math.max(
			this.player.velocity.x - PlayerConfig.acceleration,
			-PlayerConfig.maxSpeed
		);
	}

	slowDown() {
		if (this.player.velocity.x > 0) {
			this.player.velocity.x = Math.max(
				0,
				this.player.velocity.x - PlayerConfig.deceleration
			);
		} else if (this.player.velocity.x < 0) {
			this.player.velocity.x = Math.min(
				0,
				this.player.velocity.x + PlayerConfig.deceleration
			);
		}
	}

	applyGravity(dt) {
		if (!this.player.isOnGround) {
			this.player.velocity.y = Math.min(
				this.player.velocity.y + PlayerConfig.gravity * dt,
				PlayerConfig.maxFallSpeed
			);
		}
	}

	updatePosition(dt) {
		const dx = this.player.velocity.x * dt;
		const dy = this.player.velocity.y * dt;

		this.player.position.x += dx;
		this.collisionDetector.checkHorizontalCollisions(this.player);
		this.player.position.y += dy;
		this.collisionDetector.checkVerticalCollisions(this.player);

		this.player.position.x = Math.max(
			0,
			Math.min(
				Math.round(this.player.position.x),
				this.player.map.width * Tile.SIZE - this.player.dimensions.x
			)
		);
		this.player.position.y = Math.round(this.player.position.y);
	}
}
