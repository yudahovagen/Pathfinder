/*
0 - f(n)=g(n)+h(n)
  g(n) is accumilated with each traverse on the grid and h(n) is just diffrenet based on the manhatan distance

1 - first we need to initialized the heuristic values for each node based on the finishNode

2 - we go from the startNode and look at his neighbors, for each neighbor we calculate its f(n):
  f(n) = h(n) + g(n);
  while g(n) is the cost and is calculated as:
    node.distance + node.weight that were defined in dijkstra as neighbor.distance 
  if we get to the finishNode we stop the loop
  
3 - now we need to show the shortest path:
  we can use a stack to put all the 
  */
import {
  getAllNodes,
  getUnvisitedNeighbors,
  sortNodesByGoalDistance,
} from "./utilityFunctions";

export function aStar(grid, startNode, finishNode) {
  const heuristicGrid = heuristicValue(grid, startNode, finishNode);

  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.goalDistance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    //we will use a sorted array by distance to showcase shortest distance instead of using priority queue
    sortNodesByGoalDistance(unvisitedNodes);
    //unvisitedNodes decrease by 1 and the closestNode is saved
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    //if we found the finishNode
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, heuristicGrid);
  }
}

export function heuristicValue(grid, start, end) {
  const row = grid.length;
  const col = grid[0].length;
  const heuristicGrid = new Array(row);
  for (let k = 0; k < heuristicGrid.length; k++) {
    heuristicGrid[k] = new Array(col);
  }
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      heuristicGrid[i][j] = Math.abs(j - end.col) + Math.abs(i - end.row);
    }
  }
  return heuristicGrid;
}

//updating neighbor distance by one and his previous node as the current node
function updateUnvisitedNeighbors(node, grid, heuristicGrid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

  for (const neighbor of unvisitedNeighbors) {
    const heuristicValue = heuristicGrid[neighbor.row][neighbor.col];
    //updating the neighbor distance by using the node distand and weight
    neighbor.goalDistance = node.distance + node.weight + heuristicValue;
    neighbor.distance = neighbor.goalDistance - heuristicValue;
    neighbor.previousNode = node;
  }
}
// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
