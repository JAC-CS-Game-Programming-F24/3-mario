import PlayerState from './PlayerState.js';
import PlayerStateName from '../enums/PlayerStateName.js';

export default class PlayerFallingState extends PlayerState {
	constructor(player) {
		super(player);
	}

	enter() {
		this.player.currentAnimation = this.player.animations.fall;
	}

	update(dt) {
		super.update(dt);

		this.handleHorizontalMovement();
		this.checkTransitions();
	}

	checkTransitions() {
		if (Math.abs(this.player.velocity.y) < 1) {
			if (Math.abs(this.player.velocity.x) < 1) {
				this.player.stateMachine.change(PlayerStateName.Idling);
			} else {
				this.player.stateMachine.change(PlayerStateName.Walking);
			}
		}
	}
}
