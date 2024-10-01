import { images } from '../../globals.js';
import {
	loadPlayerSprites,
	smallSpriteConfig,
} from '../../../config/SpriteConfig.js';
import Vector from '../../../lib/Vector.js';
import ImageName from '../../enums/ImageName.js';
import Animation from '../../../lib/Animation.js';
import Entity from '../Entity.js';
import StateMachine from '../../../lib/StateMachine.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import PlayerWalkingState from './PlayerWalkingState.js';
import PlayerJumpingState from './PlayerJumpingState.js';
import PlayerSkiddingState from './PlayerSkiddingState.js';
import PlayerFallingState from './PlayerFallingState.js';
import PlayerIdlingState from './PlayerIdlingState.js';

export default class Player extends Entity {
	constructor(x, y, width, height, map) {
		super(x, y, width, height);

		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.map = map;
		this.jumpTime = 0;
		this.facingRight = true;

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

		this.stateMachine = new StateMachine();

		this.stateMachine.add(
			PlayerStateName.Walking,
			new PlayerWalkingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Jumping,
			new PlayerJumpingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Skidding,
			new PlayerSkiddingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Falling,
			new PlayerFallingState(this)
		);
		this.stateMachine.add(
			PlayerStateName.Idling,
			new PlayerIdlingState(this)
		);
	}

	update(dt) {
		this.stateMachine.update(dt);
	}

	render(context) {
		this.stateMachine.render(context);
	}
}
