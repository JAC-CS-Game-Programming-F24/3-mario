import Input from '../../lib/Input.js';
import { images, input, TILE_SIZE } from '../globals.js';
import { PlayerConfig } from '../../config/PlayerConfig.js';
import {
	loadPlayerSprites,
	smallSpriteConfig,
} from '../../config/SpriteConfig.js';
import Vector from '../../lib/Vector.js';
import Tile from '../services/Tile.js';
import ImageName from '../enums/ImageName.js';
import Animation from '../../lib/Animation.js';

export default class Player {
	constructor(x, y, width, height, map) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.map = map;
		this.jumpTime = 0;
		this.isJumping = false;
		this.isOnGround = false;
		this.facingRight = true;
		this.isSkidding = false;
		this.skidDirection = 0;

		this.sprites = loadPlayerSprites(
			images.get(ImageName.Mario),
			smallSpriteConfig
		);

		this.animations = {
			idle: new Animation(this.sprites.idle),
			walk: new Animation(this.sprites.walk, 0.07),
			jump: new Animation(this.sprites.jump),
			fall: new Animation(this.sprites.fall),
			skid: new Animation(this.sprites.skid),
		};

		this.currentAnimation = this.animations.idle;
	}

	update(dt) {
		this.handleHorizontalMovement();
		this.handleJumping(dt);
		this.applyGravity(dt);
		this.updateAnimation(dt);
		this.updatePosition(dt);
	}

	updateAnimation(dt) {
		this.currentAnimation.update(dt);

		if (this.isSkidding) {
			this.currentAnimation = this.animations.skid;
		} else if (this.isOnGround) {
			if (Math.abs(this.velocity.x) > 0.1) {
				this.currentAnimation = this.animations.walk;
			} else {
				this.currentAnimation = this.animations.idle;
			}
		} else {
			if (this.velocity.y < 0) {
				this.currentAnimation = this.animations.jump;
			} else {
				this.currentAnimation = this.animations.fall;
			}
		}
	}

	handleHorizontalMovement() {
		// Start skidding
		if (this.shouldSkid()) {
			this.isSkidding = true;
			this.facingRight = !this.facingRight;
		}

		if (this.isSkidding) {
			this.slowDown();

			// Check if skidding is complete
			if (Math.abs(this.velocity.x) < 1) {
				this.isSkidding = false;
			}
		} else if (
			input.isKeyHeld(Input.KEYS.A) &&
			input.isKeyHeld(Input.KEYS.D)
		) {
			this.slowDown();
		} else if (input.isKeyHeld(Input.KEYS.A)) {
			this.moveLeft();
			this.facingRight = false;
		} else if (input.isKeyHeld(Input.KEYS.D)) {
			this.moveRight();
			this.facingRight = true;
		} else {
			this.slowDown();
		}

		// Set speed to zero if it's close to zero to stop the player
		if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
	}

	moveRight() {
		this.velocity.x = Math.min(
			this.velocity.x + PlayerConfig.acceleration,
			PlayerConfig.maxSpeed
		);
	}

	moveLeft() {
		this.velocity.x = Math.max(
			this.velocity.x - PlayerConfig.acceleration,
			-PlayerConfig.maxSpeed
		);
	}

	slowDown() {
		if (this.velocity.x > 0) {
			this.velocity.x = Math.max(
				0,
				this.velocity.x - PlayerConfig.deceleration
			);
		} else if (this.velocity.x < 0) {
			this.velocity.x = Math.min(
				0,
				this.velocity.x + PlayerConfig.deceleration
			);
		}
	}

	shouldSkid() {
		return (
			this.isOnGround &&
			!this.isSkidding &&
			Math.abs(this.velocity.x) > PlayerConfig.skidThreshold &&
			((input.isKeyHeld(Input.KEYS.A) && this.velocity.x > 0) ||
				(input.isKeyHeld(Input.KEYS.D) && this.velocity.x < 0))
		);
	}

	handleJumping(dt) {
		// Start jump if conditions are met
		if (this.canJump() && input.isKeyHeld(Input.KEYS.SPACE)) {
			this.startJump();
		}

		// Continue jump if key is held and within max jump time
		if (
			this.isJumping &&
			input.isKeyHeld(Input.KEYS.SPACE) &&
			this.jumpTime <= PlayerConfig.maxJumpTime
		) {
			this.continueJump(dt);
		} else {
			this.endJump();
		}

		// Cut jump short if key is released early
		if (!input.isKeyHeld(Input.KEYS.SPACE) && this.velocity.y < 0) {
			this.velocity.y *= 0.5;
		}
	}

	canJump() {
		return this.isOnGround && !this.isJumping;
	}

	startJump() {
		this.velocity.y = PlayerConfig.jumpPower;
		this.isJumping = true;
		this.jumpTime = 0;
		this.jumpBuffer = 0;
	}

	continueJump(dt) {
		this.velocity.y =
			PlayerConfig.jumpPower *
			(1 - this.jumpTime / PlayerConfig.maxJumpTime);
		this.jumpTime += dt;
	}

	endJump() {
		this.isJumping = false;
		this.jumpTime = 0;
	}

	applyGravity(dt) {
		if (!this.isOnGround) {
			this.velocity.y = Math.min(
				this.velocity.y + PlayerConfig.gravity * dt,
				PlayerConfig.maxFallSpeed
			);
		}
	}

	updatePosition(dt) {
		// Use delta time to calculate position change
		const dx = this.velocity.x * dt;
		const dy = this.velocity.y * dt;

		// Update position
		this.position.x += dx;
		this.position.y += dy;
		this.checkVerticalCollisions();

		// Round position to nearest pixel to prevent sub-pixel rendering
		// clamp the position to prevent the player from going out of bounds
		this.position.x = Math.max(
			0,
			Math.min(
				Math.round(this.position.x),
				this.map.width * TILE_SIZE - this.dimensions.x
			)
		);
		this.position.y = Math.round(this.position.y);
	}

	checkVerticalCollisions() {
		this.isOnGround = false;

		if (this.velocity.y >= 0) {
			if (
				this.position.y + this.dimensions.y >=
				this.map.height * Tile.SIZE - Tile.SIZE * 2
			) {
				this.position.y =
					this.map.height * Tile.SIZE -
					this.dimensions.y -
					Tile.SIZE * 2;
				this.velocity.y = 0;
				this.isOnGround = true;
			}
		}
	}

	render(context) {
		if (this.facingRight) {
			context.scale(-1, 1);
			context.translate(
				Math.floor(-this.position.x - this.dimensions.x),
				Math.floor(this.position.y)
			);
		} else {
			context.translate(
				Math.floor(this.position.x),
				Math.floor(this.position.y)
			);
		}

		this.currentAnimation.getCurrentFrame().render(0, 0);

		context.restore();
	}
}
