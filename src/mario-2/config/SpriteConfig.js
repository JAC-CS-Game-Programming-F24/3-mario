import Sprite from '../lib/Sprite.js';

export const smallSpriteConfig = {
	idle: [{ x: 24, y: 48, width: 16, height: 24 }],
	lookUp: [{ x: 76, y: 48, width: 16, height: 24 }],
	duck: [{ x: 128, y: 56, width: 16, height: 16 }],
	walk: [
		{ x: 180, y: 48, width: 16, height: 24 },
		{ x: 232, y: 48, width: 16, height: 24 },
		{ x: 284, y: 48, width: 16, height: 24 },
	],
	run: [
		{ x: 336, y: 48, width: 16, height: 24 },
		{ x: 388, y: 48, width: 16, height: 24 },
		{ x: 440, y: 48, width: 16, height: 24 },
	],
	skid: [{ x: 700, y: 48, width: 16, height: 24 }],
	pipe: [{ x: 24, y: 112, width: 16, height: 24 }],
	jump: [{ x: 76, y: 112, width: 16, height: 24 }],
	fall: [{ x: 128, y: 112, width: 16, height: 24 }],
	runJump: [{ x: 180, y: 112, width: 16, height: 24 }],
	spinJump: [
		{ x: 232, y: 48, width: 16, height: 24 },
		{ x: 284, y: 48, width: 16, height: 24 },
		{ x: 336, y: 48, width: 16, height: 24 },
		{ x: 388, y: 48, width: 16, height: 24 },
	],
	slide: [{ x: 440, y: 112, width: 16, height: 24 }],
	kick: [{ x: 492, y: 112, width: 16, height: 24 }],
	swim: [
		{ x: 544, y: 48, width: 16, height: 24 },
		{ x: 596, y: 48, width: 16, height: 24 },
		{ x: 648, y: 48, width: 16, height: 24 },
	],
	victory: [{ x: 700, y: 112, width: 16, height: 24 }],
	death: [{ x: 544, y: 266, width: 16, height: 24 }],
	dust: [
		{ x: 12, y: 3566, width: 8, height: 8 },
		{ x: 32, y: 3566, width: 8, height: 8 },
		{ x: 52, y: 3566, width: 8, height: 8 },
	],
	grow: [
		{ x: 596, y: 258, width: 16, height: 32 }, // small
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 596, y: 258, width: 16, height: 32 }, // small
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 596, y: 258, width: 16, height: 32 }, // small
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 700, y: 258, width: 16, height: 32 }, // big
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 700, y: 258, width: 16, height: 32 }, // big
		{ x: 648, y: 258, width: 16, height: 32 }, // middle
		{ x: 700, y: 258, width: 16, height: 32 }, // big
	],
};

export function loadPlayerSprites(spriteSheet, spriteConfig) {
	const sprites = {};

	for (const [animationName, frames] of Object.entries(spriteConfig)) {
		sprites[animationName] = frames.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
	}

	return sprites;
}
