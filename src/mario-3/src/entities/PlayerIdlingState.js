import PlayerState from './PlayerState.js';
import Input from '../../lib/Input.js';
import { input } from '../globals.js';
import PlayerStateName from '../enums/PlayerStateName.js';

export default class PlayerIdlingState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		this.player.velocity.x = 0;
		this.player.velocity.y = 0;
		this.player.currentAnimation = this.player.animations.idle;
	}

	update(dt) {
		super.update(dt);
		this.handleInput();
		this.handleHorizontalMovement();
	}

	handleInput() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Jumping);
		}

		// If the player is pressing A or D, not both, change to the walking state.
		if (input.isKeyHeld(Input.KEYS.A) !== input.isKeyHeld(Input.KEYS.D)) {
			this.player.stateMachine.change(PlayerStateName.Walking);
		}
	}
}
