import React from "react";
import "./Node.css";

const Node = (props) => {
  //destructering from props
  const {
    col,
    row,
    isWall,
    weight,
    isStart,
    isFinish,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  } = props;

  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : weight > 1
    ? "node-weight"
    : isWall
    ? "node-wall"
    : "";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col, isStart, isFinish)}
      onMouseEnter={() => onMouseEnter(row, col, isStart, isFinish)}
      onMouseUp={() => onMouseUp()}></div>
  );
};

export default Node;
