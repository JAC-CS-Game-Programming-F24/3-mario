import PlayerState from './PlayerState.js';
import { input } from '../globals.js';
import { PlayerConfig } from '../../config/PlayerConfig.js';
import Input from '../../lib/Input.js';
import PlayerStateName from '../enums/PlayerStateName.js';

export default class PlayerJumpingState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		this.player.jumpTime = 0;
		this.player.velocity.y = PlayerConfig.jumpPower;
		this.player.currentAnimation = this.player.animations.jump;
	}

	exit() {}

	update(dt) {
		super.update(dt);

		this.handleInput();
		this.handleHorizontalMovement();
		this.handleJumping(dt);

		this.checkTransitions();
	}

	handleInput() {
		if (!input.isKeyHeld(Input.KEYS.SPACE) && this.player.velocity.y < 0) {
			this.player.velocity.y *= 0.5;
		}
	}

	handleJumping(dt) {
		if (
			input.isKeyHeld(Input.KEYS.SPACE) &&
			this.player.jumpTime <= PlayerConfig.maxJumpTime
		) {
			this.player.velocity.y =
				PlayerConfig.jumpPower *
				(1 - this.player.jumpTime / PlayerConfig.maxJumpTime);
			this.player.jumpTime += dt;
		} else {
			this.player.jumpTime = 0;
		}
	}

	checkTransitions() {
		if (this.player.velocity.y >= 0) {
			this.player.stateMachine.change(PlayerStateName.Falling);
		}
	}
}
