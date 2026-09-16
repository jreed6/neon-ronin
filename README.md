# Neon Ronin

A one-level Canvas action game set above a rainy cyberpunk city. Original procedural art, no asset downloads or build dependencies. Optional Google Fonts have local fallbacks.

## Run

With Node.js installed, run `node server.mjs`, then open http://127.0.0.1:4173. Run `node --test` for the simulation tests.

## Controls

- A/D or arrows: run
- Space, W, or up arrow: jump (twice for a double jump)
- J: sword; hold to repeat; slashes also deflect nearby projectiles
- K: throw shuriken; hold to repeat; ammunition regenerates
- P/Escape: pause
- Touch buttons are available on narrow screens

Cross four rooftop gaps and reach the cyan extraction gate. Combat is optional. Swordsmen close distance, drones fire from above, and armored gunners withstand more hits. Two checkpoints heal you and provide recovery after falling. Defeated enemies restore one star. Losing all health ends the run. Backgrounding the game automatically pauses it.

## Structure

`engine.js`: isolated simulation and level data. `game.js`: Canvas art, input, sound, UI. `style.css`: responsive shell. `server.mjs`: loopback-only development server.

Prototype scope: one level, synthesized effects, no save data, no external game engine. The default sound setting is off. Desktop keyboard is the primary control scheme.
