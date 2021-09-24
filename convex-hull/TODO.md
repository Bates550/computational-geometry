## TODO

- [ ] When paused and on a previous iteration via arrows, unpausing should start at the current iteration instead of latest
- [ ] Publish to github pages

## DONE

- [x] Add previous with keyboard
- [x] Add next with keyboard
- [x] Add pause with keyboard
- [x] Fix crash on algorithm finish
- [x] Make yielded rendering output of a consistent type
  - THREE.Vector3? { x, y, z }? [x, y, z]?
  - Went with [x, y, z] because it was simple and more on the agnostic side
- [x] Get gift-wrapping algorithm working with yields
- [x] Get gift-wrapping algorithm working without the yields
