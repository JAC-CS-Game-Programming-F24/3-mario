import PlayerState from './PlayerState.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import { input } from '../globals.js';
import Input from '../../lib/Input.js';

export default class PlayerSkiddingState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		this.player.currentAnimation = this.player.animations.skid;
	}

	exit() {}

	update(dt) {
		super.update(dt);
		this.handleInput();
		this.handleSkidding();
		this.checkTransitions();
	}

	handleInput() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.stateMachine.change(PlayerStateName.Jumping);
		}
	}

	handleSkidding() {
		this.slowDown();
		if (Math.abs(this.player.velocity.x) < 0.1) this.player.velocity.x = 0;
	}

	checkTransitions() {
		if (Math.abs(this.player.velocity.x) < 1) {
			if (
				input.isKeyHeld(Input.KEYS.A) ||
				input.isKeyHeld(Input.KEYS.D)
			) {
				this.player.stateMachine.change(PlayerStateName.Walking);
			} else {
				this.player.stateMachine.change(PlayerStateName.Idling);
			}
		}
	}
}
