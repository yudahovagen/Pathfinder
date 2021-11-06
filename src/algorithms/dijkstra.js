import {
  getAllNodes,
  sortNodesByDistance,
  getUnvisitedNeighbors,
} from "./utilityFunctions";

/* 
Performs Dijkstra's algorithm; returns all nodes in the order0.
in which they were visited. Also makes nodes point back to their
previous node, effectively allowing us to compute the shortest path
by backtracking from the finish node.
*/
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    //we will use a sorted array by distance to showcase shortest distance instead of using priority queue
    sortNodesByDistance(unvisitedNodes);
    //unvisitedNodes decrease by 1 and the closestNode is saved
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    //we need to make sure there isnt any other way to go to the finishNode
    //if we found the finishNode
    if (closestNode === finishNode) {
      console.log(unvisitedNodes);      
      console.log(visitedNodesInOrder);
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighbors(closestNode, grid);
  }
}
//updating neighbor distance by one and his previous node as the current node
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    //updating the neighbor distance by using the node distand and weight
    neighbor.distance = node.distance + node.weight;
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
