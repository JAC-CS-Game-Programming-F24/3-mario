import State from '../../lib/State.js';
import Debug from '../../lib/Debug.js';
import Map from '../services/Map.js';
import Camera from '../services/Camera.js';
import { canvas, timer } from '../globals.js';
import Player from '../entities/player/Player.js';
import Tile from '../services/Tile.js';

export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

		this.map = new Map(mapDefinition);
		this.player = new Player(50, 150, 16, 24, this.map);
		this.camera = new Camera(
			this.player,
			canvas.width,
			canvas.height,
			this.map.width * Tile.SIZE,
			this.map.height * Tile.SIZE
		);

		// Create Debug instance
		this.debug = new Debug();

		// Watch player properties
		this.debug.watch('Map', {
			width: () => this.map.width,
			height: () => this.map.height,
		});

		this.debug.watch('Camera', {
			position: () =>
				`(${this.camera.position.x.toFixed(
					2
				)}, ${this.camera.position.y.toFixed(2)})`,
			lookahead: () =>
				`(${this.camera.lookahead.x.toFixed(
					2
				)}, ${this.camera.lookahead.y.toFixed(2)})`,
		});

		this.debug.watch('Player', {
			position: () =>
				`(${this.player.position.x.toFixed(
					2
				)}, ${this.player.position.y.toFixed(2)})`,
			velocity: () =>
				`(${this.player.velocity.x.toFixed(
					2
				)}, ${this.player.velocity.y.toFixed(2)})`,
			isOnGround: () => this.player.isOnGround,
			jumpTime: () => this.player.jumpTime.toFixed(2),
			state: () => this.player.stateMachine.currentState.name,
		});
	}

	update(dt) {
		timer.update(dt);
		this.debug.update();
		this.map.update(dt);
		this.camera.update(dt);
		this.player.update(dt);
	}

	render(context) {
		this.camera.applyTransform(context);

		this.map.render(context);
		this.player.render(context);

		this.camera.resetTransform(context);

		// this.renderCameraGuidelines(context);
		// this.renderLookahead(context);
	}

	renderLookahead(context) {
		const lookaheadPos = this.camera.getLookaheadPosition();
		const size = 10;

		context.strokeStyle = 'rgba(255, 0, 0, 0.8)';
		context.lineWidth = 2;

		// Draw crosshair
		context.beginPath();
		context.moveTo(lookaheadPos.x - size, lookaheadPos.y);
		context.lineTo(lookaheadPos.x + size, lookaheadPos.y);
		context.moveTo(lookaheadPos.x, lookaheadPos.y - size);
		context.lineTo(lookaheadPos.x, lookaheadPos.y + size);
		context.stroke();

		// Draw circle
		context.beginPath();
		context.arc(lookaheadPos.x, lookaheadPos.y, size / 2, 0, Math.PI * 2);
		context.stroke();
	}

	renderCameraGuidelines(context) {
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		// Set line style
		context.setLineDash([5, 5]); // 5 pixels dash, 5 pixels space
		context.lineWidth = 1;
		context.strokeStyle = 'rgba(255, 255, 255, 0.9)'; // Semi-transparent white

		// Draw vertical line
		context.beginPath();
		context.moveTo(centerX, 0);
		context.lineTo(centerX, canvas.height);
		context.stroke();

		// Draw horizontal line
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvas.width, centerY);
		context.stroke();

		// Reset line style
		context.setLineDash([]);
	}
}
