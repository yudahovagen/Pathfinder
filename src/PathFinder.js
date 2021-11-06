/*
  - message if no algorithm selected
  - explanation about each algorithm
  - fast foward animation to finish
  - animation speed button
  - mazes + random
  - unwieghted after you pick weighted
  - returnning weighted nodes if wighted algorithm was picked after animation for unweighted algo
*/
import React, { useEffect, useState, useRef } from "react";
import Node from "./components/Node/Node";
import Header from "./components/Header/Header";
import { dijkstra, getNodesInShortestPathOrder } from "./algorithms/dijkstra";
import { aStar } from "./algorithms/aStar";
import { dfs } from "./algorithms/dfs";
import { greedy } from "./algorithms/greedy";
import "./PathFinder.css";
import Toolbar from "./components/toolbar/Toolbar";

//some constants to make the grid dynamic in relation to the screen resulotion
//width - 30 ; height - 55
const COL = Math.floor((window.screen.width * window.devicePixelRatio) / 50);
const ROW = Math.floor((window.screen.height * window.devicePixelRatio) / 80);
const START_NODE_ROW = Math.floor(ROW / 2);
const START_NODE_COL = Math.floor(COL / 7);
const FINISH_NODE_ROW = Math.floor(ROW / 2);
const FINISH_NODE_COL = COL - Math.floor(COL / 7);
const ANIMSPEEDHELPER = {
  Fast: [25, 50],
  Average: [100, 200],
  Slow: [300, 600],
};
/*
lets try converting it to reducer
*/
const PathFinder = () => {
  //our node grid
  const [grid, setGrid] = useState([]);
  //calculating the cost for weighted algorithms
  const [cost, setCost] = useState(0);
  //indication that there is a visualization going on and that we want to disable the header buttons
  const [visuallizingOnGoing, setVisuallizingOnGoing] = useState(false);
  //weight button - put weight nodes in the grid instead of a wall
  const [toggleWeightButton, setToggleWeightButton] = useState(false);
  //indicator
  const [mouseIsPressed, setMouseIsPressed] = useState({
    wall: false,
    weightPressed: false,
    start: false,
    finish: false,
  });
  //flag represent either start node or finish node
  const [flagPressed, setFlagPressed] = useState({
    type: "",
    node: {
      row: null,
      col: null,
    },
  });
  //indicator that there are no routes availabe to the finish node
  const [noRoutes, setNoRoutes] = useState(false);
  //animation speed state using onchange
  const [animSpeed, setAnimSpeed] = useState("Fast");
  //ref to the selected algorithm
  const selectAlgo = useRef("");
  //initiating the nodes Grid
  useEffect(() => {
    setGrid([...initiateGrid()]);
  }, []);
  const handleMouseDown = (row, col, isStart, isFinish) => {
    //we need to make sure that there is no visualiztion going on before we even handel cases
    if (visuallizingOnGoing) {
      return;
    }
    //in case we click the start/finish nodes
    if (isStart || isFinish) {
      //flag represnet which node did we clicked start/finish
      const flag = isStart ? "start" : isFinish ? "finish" : "";
      setFlagPressed({
        type: flag,
        node: {
          row: row,
          col: col,
        },
      });
      //now we want to check whether we want to put wall/weight in that node
    } else if (toggleWeightButton) {
      //change node to weighted node
      const newGrid = getNewGridWithWallToggled(grid, row, col, "weight");
      setGrid(newGrid);
      setMouseIsPressed({ ...mouseIsPressed, weightPressed: true });
    } else {
      //change node to a wall
      const newGrid = getNewGridWithWallToggled(grid, row, col, "wall");
      setGrid(newGrid);
      setMouseIsPressed({ ...mouseIsPressed, wall: true });
    }
  };
  const handleMouseEnter = (row, col, isStart, isFinish, wall) => {
    if (flagPressed.type !== "") {
      //
      const newGrid = getNewGridWithFlagToggled(grid, row, col, flagPressed);
      setFlagPressed({
        ...flagPressed,
        node: {
          row: row,
          col: col,
        },
      });
      setGrid(newGrid);
      //we still need to change mousIsPressed and so on
    }

    if (!mouseIsPressed.wall && !mouseIsPressed.weightPressed) return;

    if (toggleWeightButton) {
      const newGrid = getNewGridWithWallToggled(grid, row, col, "weight");
      setGrid(newGrid);
      setMouseIsPressed({ ...mouseIsPressed, weightPressed: true });
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col, "wall");
      setGrid(newGrid);
      setMouseIsPressed({ ...mouseIsPressed, wall: true });
      //incase of start or finish we want to change to true but turn it back to false as soon as we leave the node
    }
  };
  const handleMouseUp = () => {
    if (flagPressed.type !== "") {
      //reseting the flag
      setFlagPressed({
        type: "",
        node: {
          row: null,
          col: null,
        },
      });
    }
    setMouseIsPressed({ ...mouseIsPressed, wall: false, weightPressed: false });
    //incase of start or finish the mouse up will prevent it from dissapiring after the mouse enter event
  };
  const visualizeAstar = () => {
    let tmp = getStartAndFinishNode(grid);
    const startNode = tmp[0];
    const finishNode = tmp[1];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  };
  const visualizeGreedy = () => {
    let tmp = getStartAndFinishNode(grid);
    const startNode = tmp[0];
    const finishNode = tmp[1];
    const visitedNodesInOrder = greedy(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  };
  const visualizeDijkstra = () => {
    let tmp = getStartAndFinishNode(grid);
    const startNode = tmp[0];
    const finishNode = tmp[1];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  };
  const visualizeBFS = () => {
    //bfs is equal to dijkstra for equal wieghts
    //revert all wieghts to 1 and implement dijkstra
    setGrid(removeWieghts(grid));
    visualizeDijkstra();
  };
  const visualizeDFS = () => {
    setGrid(removeWieghts(grid));
    let tmp = getStartAndFinishNode(grid);
    const startNode = tmp[0];
    const finishNode = tmp[1];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    animate(visitedNodesInOrder, visitedNodesInOrder);
  };
  const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    //disable the header
    setVisuallizingOnGoing(true);
    ////there is NO route to the finish node
    if (nodesInShortestPathOrder.length === 1) {
      setNoRoutes(true);
      //cleanup effect that take place 3 sec after the message of no route is displayed
      setTimeout(() => {
        setNoRoutes(false);
        setVisuallizingOnGoing(false);
      }, 3000);
    }
    //there is a route to the finish node
    else {
      //firstly we calculate the total cost of the projected route by summing all the weights in the the array
      let tmpCost = 0;
      tmpCost = nodesInShortestPathOrder.reduce((acc, cur) => {
        return acc + cur.weight;
      }, 0);
      const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            if (node.isStart) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-start node-shortest-path";
            } else if (node.isFinish) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-finish node-shortest-path";
            } else if (node.weight !== 1) {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-weight node-shortest-path";
            } else {
              document.getElementById(
                `node-${node.row}-${node.col}`
              ).className = "node node-shortest-path";
            }
          }, ANIMSPEEDHELPER[animSpeed][1] * i);
        }
        //we need to know if the current algorithm is weighted or unwighted
        const choosenAlgorithm = selectAlgo.current.value;
        //here we toggle the visualizing on going element to false and updating the cost base on the type of algorithm
        if (choosenAlgorithm !== "DFS" && choosenAlgorithm !== "BFS") {
          setTimeout(() => {
            setVisuallizingOnGoing(false);
            setCost("total cost: " + tmpCost);
          }, nodesInShortestPathOrder.length * ANIMSPEEDHELPER[animSpeed][1]);
        } else {
          setTimeout(() => {
            setVisuallizingOnGoing(false);
            setCost("unweighted algorithms dont have cost");
          }, nodesInShortestPathOrder.length * ANIMSPEEDHELPER[animSpeed][1]);
        }
      };
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder);
          }, ANIMSPEEDHELPER[animSpeed][0] * i);
          return;
        }

        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          if (node.isStart) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-start node-visited";
          } else if (node.isFinish) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-finish node-visited";
          } else if (node.weight !== 1) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-weight node-visited";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-visited";
          }
        }, ANIMSPEEDHELPER[animSpeed][0] * i);
      }
    }
  };
  const removeWalls = () => {
    //looping through resetting isWall/distance/isVisited/previousNode
    //after that we setting the new grid
    const newGrid = grid.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        const node = newGrid[i][j];
        const newNode = {
          ...node,
          isWall: false,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          weight: 1,
          goalDistance: Infinity,
        };
        newGrid[i][j] = newNode;
      }
    }
    setGrid(newGrid);
  };
  const clearAll = () => {
    //looping through the grid and reseting every node
    //after that we returning the new grid and setting it
    const newGrid = grid.slice();
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const node = newGrid[i][j];
        const newNode = {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        };
        newGrid[i][j] = newNode;
        //----
        if (newGrid[i][j].isStart) {
          const node = newGrid[i][j];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        } else if (newGrid[i][j].isFinish) {
          const node = newGrid[i][j];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        } else {
          const node = newGrid[i][j];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
      }
    }
    setGrid(newGrid);
    removeWalls();
  };
  const visualize = () => {
    const choosenAlgorithm = selectAlgo.current.value;
    //we need to reset both distance values and isVisited
    setGrid(resetDistanceAndVisited(grid));
    clearPath();
    switch (choosenAlgorithm) {
      case "Select an Algorithm":
        //we want to change the css of the "cost" class to increase the text font for 2 secondes
        document.querySelector(".cost").className = ".costGrand";
        break;
      case "dijkstra":
        visualizeDijkstra();
        break;
      case "aStar":
        visualizeAstar();
        break;
      case "greedy":
        visualizeGreedy();
        break;
      case "DFS":
        visualizeDFS();
        break;
      case "BFS":
        visualizeBFS();
        break;
      default:
        console.log("please choose an algorithm");
    }
  };
  const clearPath = () => {
    //loop trough the entier grid and reseting the distance, marking as not visited and removing the visited/shortest class element
    const newGrid = grid.slice();
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        const node = newGrid[i][j];
        const newNode = {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          goalDistance: Infinity,
        };
        newGrid[i][j] = newNode;
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        } else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        } else if (node.weight > 1) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-weight";
        } else if (node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-wall";
        } else if (node.isVisited) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
      }
    }
    setGrid(newGrid);
  };
  const handleChange = (e) => {
    setAnimSpeed(e.target.value);
  };
  return (
    <>
      <div className="headLine">
        <div className="title">PathFinding Visualizer</div>
        <Header
          toggleWeightButton={toggleWeightButton}
          setToggleWeightButton={setToggleWeightButton}
          selectAlgo={selectAlgo}
          clearPath={clearPath}
          clearAll={clearAll}
          animSpeed={animSpeed}
          handleChange={handleChange}
          visualize={visualize}
          visuallizingOnGoing={visuallizingOnGoing}
        />
      </div>
      <Toolbar />
      {cost !== 0 ? (
        <div className="cost">{cost}</div>
      ) : (
        <div className="explenation">select an algorithm and visualize it</div>
      )}
      {noRoutes ? (
        <div className="gridTitle">no valid route avaliabe!</div>
      ) : null}

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="gridRow">
              {row.map((node, nodeIdx) => {
                const { row, col, isWall, isStart, isFinish, weight } = node;
                return (
                  <Node
                    key={nodeIdx}
                    row={row}
                    col={col}
                    isWall={isWall}
                    weight={weight}
                    isFinish={isFinish}
                    isStart={isStart}
                    mouseIsPressed={mouseIsPressed}
                    onMouseEnter={(row, col, isStart, isFinish) =>
                      handleMouseEnter(row, col, isStart, isFinish)
                    }
                    onMouseDown={(row, col, isStart, isFinish) =>
                      handleMouseDown(row, col, isStart, isFinish)
                    }
                    onMouseUp={() => handleMouseUp()}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
const initiateGrid = () => {
  const nodes = [];
  for (let row = 0; row < ROW; row++) {
    const currentRow = [];
    for (let col = 0; col < COL; col++) {
      currentRow.push(initiateNode(col, row));
    }
    nodes.push(currentRow);
  }
  return nodes;
};
const initiateNode = (col, row) => {
  return {
    col,
    row,
    distance: Infinity,
    isVisited: false,
    previousNode: null,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isWall: false,
    weight: 1,
    goalDistance: Infinity,
  };
};
//this function cover both walled and wieghted node case
const getNewGridWithWallToggled = (grid, row, col, type) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.isStart || node.isFinish) {
    return newGrid;
  } else if (type === "weight") {
    if (node.weight !== 10) {
      let newNode = {
        ...node,
        weight: 10,
        isWall: false,
      };
      newGrid[row][col] = newNode;
      return newGrid;
    } else {
      let newNode = {
        ...node,
        weight: 1,
        isWall: false,
      };
      newGrid[row][col] = newNode;
      return newGrid;
    }
  } else if (type === "wall") {
    const newNode = {
      ...node,
      isWall: !node.isWall,
      weight: 1,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
};
const getNewGridWithFlagToggled = (grid, row, col, flagObj) => {
  const newGrid = grid.slice();
  //first we want to reset the old node
  //by reset i mean changing the isStart/isFinish value to false
  const oldNode = newGrid[flagObj.node.row][flagObj.node.col];
  const tmpNode = {
    ...oldNode,
    isStart: false,
    isFinish: false,
  };
  newGrid[flagObj.node.row][flagObj.node.col] = tmpNode;
  //now we need to change the current node to the flag type
  const newNode = newGrid[row][col];
  //first we check the flag type
  let lastNode;
  if (flagObj.type === "start") {
    lastNode = {
      ...newNode,
      isStart: true,
    };
  } else if (flagObj.type === "finish") {
    lastNode = {
      ...newNode,
      isFinish: true,
    };
  }
  newGrid[row][col] = lastNode;
  return newGrid;
};
const getStartAndFinishNode = (grid) => {
  //return start node and finish node
  //looping trough the array and returning the start and finish nodes
  let startNode, finishNode;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].isStart) {
        startNode = grid[i][j];
      } else if (grid[i][j].isFinish) {
        finishNode = grid[i][j];
      }
    }
  }
  return [startNode, finishNode];
};
const resetDistanceAndVisited = (grid) => {
  const newGrid = grid.slice();
  newGrid.forEach((row) =>
    row.forEach((node) => {
      node = {
        ...node,
        isVisited: false,
        distance: Infinity,
        goalDistance: Infinity,
        previousNode: null,
      };
    })
  );
  return newGrid;
};
//this function called whenever we want to visualize unweighted algorithm or clear the grid
const removeWieghts = (grid) => {
  const newGrid = grid.slice();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const node = newGrid[i][j];
      const newNode = {
        ...node,
      };
      if (newNode.weight > 1) {
        document.getElementById(
          `node-${newNode.row}-${newNode.col}`
        ).className = "node";
        newNode.weight = 1;
      }
      newGrid[i][j] = newNode;
    }
  }
  return newGrid;
};
export default PathFinder;
