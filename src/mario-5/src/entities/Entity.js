import { getCollisionDirection, isAABBCollision } from '../../lib/Collision.js';
import Vector from '../../lib/Vector.js';

export default class Entity {
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.isOnGround = false;
	}

	update() {}

	render() {}

	collidesWith(entity) {
		return isAABBCollision(
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			entity.position.x,
			entity.position.y,
			entity.dimensions.x,
			entity.dimensions.y
		);
	}

	getCollisionDirection(entity) {
		return getCollisionDirection(entity.hitbox);
	}
}
