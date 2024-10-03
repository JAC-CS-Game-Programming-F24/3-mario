import Input from '../../lib/Input.js';
import State from '../../lib/State.js';
import { PlayerConfig } from '../../config/PlayerConfig.js';
import { input } from '../globals.js';
import Tile from '../services/Tile.js';

export default class PlayerState extends State {
	constructor(player) {
		super();
		this.player = player;
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
		this.player.position.y += dy;
		this.checkVerticalCollisions();

		this.player.position.x = Math.max(
			0,
			Math.min(
				Math.round(this.player.position.x),
				this.player.map.width * this.player.map.tileSize -
					this.player.dimensions.x
			)
		);
		this.player.position.y = Math.round(this.player.position.y);
	}

	checkBlockCollision(tileX, tileY) {
		const block = this.player.map.getBlockAt(
			tileX * this.player.map.tileSize,
			tileY * this.player.map.tileSize
		);
		if (block && !block.isHit) {
			return this.player.hitbox.didCollide(block.hitbox);
		}
		return false;
	}

	checkVerticalCollisions() {
		this.player.isOnGround = false;

		if (this.player.velocity.y >= 0) {
			if (
				this.player.position.y + this.player.dimensions.y >=
				this.player.map.height * Tile.SIZE - Tile.SIZE * 2
			) {
				this.player.position.y =
					this.player.map.height * Tile.SIZE -
					this.player.dimensions.y -
					Tile.SIZE * 2;
				this.player.velocity.y = 0;
				this.player.isOnGround = true;
			}
		}
	}
}
