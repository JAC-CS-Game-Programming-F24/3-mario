import PlayerState from './PlayerState.js';
import { input } from '../globals.js';
import { PlayerConfig } from '../../config/PlayerConfig.js';
import Input from '../../lib/Input.js';
import PlayerStateName from '../enums/PlayerStateName.js';

export default class PlayerWalkingState extends PlayerState {
	constructor(player) {
		super(player);
		this.isMovingRight = false;
		this.isMovingLeft = false;
	}

	enter() {
		this.player.isOnGround = true;
		this.player.currentAnimation = this.player.animations.walk;
	}

	update(dt) {
		super.update(dt);
		this.handleInput();
		this.handleHorizontalMovement();
		this.checkTransitions();
	}

	handleInput() {
		if (input.isKeyHeld(Input.KEYS.A) && !this.isMovingRight) {
			this.isMovingLeft = true;
		} else {
			this.isMovingLeft = false;
		}

		if (input.isKeyHeld(Input.KEYS.D) && !this.isMovingLeft) {
			this.isMovingRight = true;
		} else {
			this.isMovingRight = false;
		}

		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Jumping);
		}
	}

	checkTransitions() {
		if (Math.abs(this.player.velocity.x) < 0.1) {
			this.player.stateMachine.change(PlayerStateName.Idling);
		}

		if (this.shouldSkid()) {
			this.player.stateMachine.change(PlayerStateName.Skidding);
		}

		if (!this.player.isOnGround) {
			if (this.player.velocity.y < 0) {
				this.player.stateMachine.change(PlayerStateName.Jumping);
			} else {
				this.player.stateMachine.change(PlayerStateName.Falling);
			}
		}
	}

	shouldSkid() {
		return (
			this.player.isOnGround &&
			Math.abs(this.player.velocity.x) > PlayerConfig.skidThreshold &&
			((input.isKeyHeld(Input.KEYS.A) && this.player.velocity.x > 0) ||
				(input.isKeyHeld(Input.KEYS.D) && this.player.velocity.x < 0))
		);
	}
}
