import React from "react";
import "./index.css";

export default function Hand({ name, handRef, grabHand, moveHand }) {
  return (
    <div
      className={name}
      ref={handRef}
      onMouseDown={grabHand}
      onMouseMove={moveHand}
    ></div>
  );
}
