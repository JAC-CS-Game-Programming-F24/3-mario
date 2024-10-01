import Input from '../../lib/Input.js';
import Vector from '../../lib/Vector.js';
import { input } from '../globals.js';

export default class Camera {
	constructor(map, width, height) {
		this.map = map;
		this.width = width;
		this.height = height;
		this.mapWidth = map.width * map.tileSize;
		this.mapHeight = map.height * map.tileSize;
		this.position = new Vector(0, 0);
		this.cameraSpeed = 200;
	}

	update(dt) {
		// Move camera based on input
		if (input.isKeyHeld(Input.KEYS.W) || input.isKeyHeld(Input.KEYS.UP)) {
			this.position.y -= this.cameraSpeed * dt;
		}

		if (input.isKeyHeld(Input.KEYS.S) || input.isKeyHeld(Input.KEYS.DOWN)) {
			this.position.y += this.cameraSpeed * dt;
		}

		if (input.isKeyHeld(Input.KEYS.A) || input.isKeyHeld(Input.KEYS.LEFT)) {
			this.position.x -= this.cameraSpeed * dt;
		}

		if (
			input.isKeyHeld(Input.KEYS.D) ||
			input.isKeyHeld(Input.KEYS.RIGHT)
		) {
			this.position.x += this.cameraSpeed * dt;
		}

		// Clamp camera position to map boundaries
		this.position.x = Math.max(
			0,
			Math.min(this.position.x, this.mapWidth - this.width)
		);
		this.position.y = Math.max(
			0,
			Math.min(this.position.y, this.mapHeight - this.height)
		);

		// Round camera position to whole numbers to prevent subpixel rendering.
		this.position.x = Math.round(this.position.x);
		this.position.y = Math.round(this.position.y);
	}
}
