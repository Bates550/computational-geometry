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

## NOTES

mostRecentConvexHullPoint = [7, 3]
currentBest = [4, 4]
firstCheck = [3, 5]
secondCheck = [2, 4]

### First Check

checkedVector = firstCheck - mostRecentConvexHullPoint = [-4, 2]
currentBestVector = currentBest - mostRecentConvexHullPoint = [-3, 1]

currentBestVector X checkedVector < 0

### Second Check

checkedVector = secondCheck - mostRecentConvexHullPoint = [-5, 1]
currentBestVector = currentBest - mostRecentConvexHullPoint = [-3, 1]

currentBestVector X checkedVector > 0
