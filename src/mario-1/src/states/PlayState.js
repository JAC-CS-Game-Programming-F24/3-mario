import State from '../../lib/State.js';
import Debug from '../../lib/Debug.js';
import Map from '../services/Map.js';
import Camera from '../services/Camera.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../globals.js';

export default class PlayState extends State {
	constructor(mapDefinition) {
		super();

		this.map = new Map(mapDefinition);
		this.camera = new Camera(this.map, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Create Debug instance
		this.debug = new Debug();

		// Watch player properties
		this.debug.watch('Map', {
			width: () => this.map.width,
			height: () => this.map.height,
		});

		this.debug.watch('Camera', {
			position: () =>
				`(${this.camera.position.x}, ${this.camera.position.y})`,
		});
	}

	update(dt) {
		this.debug.update();
		this.camera.update(dt);
	}

	render(context) {
		context.font = '12px monospace';
		context.fillStyle = 'white';
		context.fillText('Use WASD or arrow keys to move the camera.', 10, 20);

		context.save();

		context.translate(-this.camera.position.x, -this.camera.position.y);

		this.map.render();

		context.restore();
	}
}
