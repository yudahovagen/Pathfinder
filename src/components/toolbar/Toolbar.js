import React from "react";
import "./Toolbar.css";

const Toolbar = () => {
  return (
    <div className="helper">
      <div>start node</div>
      <div className="node node-start"></div>
      <div>target node</div>
      <div className="node node-finish"></div>
      <div>weighted node</div>
      <div className="node node-weight"></div>
      <div>unvisited node</div>
      <div className="node"></div>
      <div>visited node</div>
      <div className="node visitedAnimation"></div>
      <div>wall node</div>
      <div className="node node-wall"></div>
      <div>shortest path node</div>
      <div className="node shortestPath"></div>
    </div>
  );
};
export default Toolbar;
