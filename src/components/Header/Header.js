import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const Header = (props) => {
  const [weightButtonVariant, setWeightButtonVariant] = useState("info");
  const {
    toggleWeightButton,
    setToggleWeightButton,
    selectAlgo,
    clearPath,
    clearAll,
    animSpeed,
    handleChange,
    visualize,
    visuallizingOnGoing,
  } = props;
//variant to change buttons theme or variant
  const toggleWeight = () => {
    if (!toggleWeightButton) {
      setToggleWeightButton(true);
      setWeightButtonVariant("dark");
    } else {
      setToggleWeightButton(false);
      setWeightButtonVariant("info");
    }
  };

  return (
    <div className="header">
      <Form>
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label style={{ color: "white", fontWeight: "bold" }}>
            Algorithm
          </Form.Label>
          <Form.Control
            as="select"
            ref={selectAlgo}
            disabled={visuallizingOnGoing}
            custom>
            <option value="">choose an algorithm</option>
            <optgroup label="Weighted Algorithms">
              <option value="dijkstra">dijkstra</option>
              <option value="aStar">A*</option>
              <option value="greedy">greedy</option>
            </optgroup>
            <optgroup label="unWeighted Algorithms">
              <option value="DFS">DFS</option>
              <option value="BFS">BFS</option>
            </optgroup>
          </Form.Control>
        </Form.Group>
      </Form>
      <Form>
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label style={{ color: "white", fontWeight: "bold" }}>
            Animation Speed
          </Form.Label>
          <Form.Control
            as="select"
            value={animSpeed}
            onChange={handleChange}
            disabled={visuallizingOnGoing}
            custom>
            <option value="Fast">Fast</option>
            <option value="Average">Average</option>
            <option value="Slow">Slow</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <Button
        disabled={visuallizingOnGoing}
        variant="info"
        onClick={() => visualize()}>
        Visualize
      </Button>
      <Button
        disabled={visuallizingOnGoing}
        variant="info"
        onClick={() => clearAll()}>
        Clear All
      </Button>
      <Button
        disabled={visuallizingOnGoing}
        variant="info"
        onClick={() => clearPath()}>
        Clear Path
      </Button>
      <Button
        disabled={visuallizingOnGoing}
        variant={weightButtonVariant}
        onClick={() => toggleWeight()}>
        Add Weighted Node
      </Button>
    </div>
  );
};

export default Header;
