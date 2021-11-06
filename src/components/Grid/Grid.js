import React, { useReducer,useState,useEffect } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "wall":
      return { state: state };
      case "inceWeight":
      return { state: state };
      case "decWeight":
      return { state: state };
      case "wall":
      return { state: state };
    default:
      return { ...state };
  }
}
const initialState = { grid: [] };

function Grid() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <div className="grid">testing</div>;
}

export default Grid;
/*
list of all the function that use the Grid component

initiateGrid
initiateNode - through the initiateGrid 
getNewGridWithWallToggled
getNewGridWithFlagToggled
getStartAndFinishNode
resetDistanceAndVisited
removeWieghts

list of all the methods that use Grid component

mouse events - enter,down,up
animate - weighted/unweighted
removeWalls
clearAll
clearPath
*/