import { getUnvisitedNeighbors } from "./utilityFunctions";
export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  let neighbors = [];
  let stack = [startNode];
  while (stack.length !== 0) {
    const current = stack[stack.length - 1];
    const { row, col } = current;
    if (current === finishNode) {
      grid[row][col].isVisited = true;
      visitedNodesInOrder.push(current);
      break;
    } else if (current.isVisited) {
      //removing and than skipping
      //no need to push him to visitedNodesInOrder because we already seen him before
      stack.splice(stack.length - 1, 1);
      continue;
    }

    //retrieve his neighbors
    neighbors = getUnvisitedNeighbors(current, grid);
    grid[row][col].isVisited = true;
    visitedNodesInOrder.push(stack[stack.length - 1]);
    stack.pop();
    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i].isWall) {
        continue;
      }
      stack.push(neighbors[i]);
    }
  }
  return visitedNodesInOrder;
}
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
