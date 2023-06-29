import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import Hand from "./Hand";

export default function DraggableClock() {
  const [counter, setCounter] = useState(0);
  const [sec, setSec] = useState("");
  const [min, setMin] = useState("");

  const [isSecDraggable, setSecDraggable] = useState(false);
  const [isMinDraggable, setMinDraggable] = useState(false);

  const counterRef = useRef();
  const clockWrapperRef = useRef();
  const minArrowRef = useRef();
  const secArrowRef = useRef();

  function getTimeString(num) {
    return `0${num % 60}`.slice(-2);
  }

  function getDegrees(num) {
    const offsetFoerZero = 90;
    return offsetFoerZero + (num / 60) * 360;
  }

  function updateTime() {
    try {
      const seconds = counter % 60;
      setSec(getTimeString(counter));
      secArrowRef.current.style.transform = `rotate(${getDegrees(seconds)}deg)`;

      const minutes = Math.floor(counter / 60);
      setMin(getTimeString(minutes));
      minArrowRef.current.style.transform = `rotate(${getDegrees(minutes)}deg)`;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    updateTime();
  }, [counter]);

  function startCounter() {
    clearInterval(counterRef.current);
    console.log(" start counter called");
    counterRef.current = setInterval(function () {
      setCounter(prev => prev + 1);
    }, 1000);
  }

  function handleMouseUp() {
    setSecDraggable(false);
    setMinDraggable(false);
    clearInterval(counterRef.current);
    startCounter();
  }

  useEffect(() => {
    clockWrapperRef.current.addEventListener("mouseup", handleMouseUp);
    return clockWrapperRef.current.addEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    startCounter();
    return () => clearInterval(counterRef.current);
  }, []);

  function grabSecHand(e) {
    setSecDraggable(true);
    clearInterval(counterRef.current);
    secArrowRef.current.style.zIndex = 2;
    minArrowRef.current.style.zIndex = 1;
  }

  function moveSecHand(e) {
    if (!isSecDraggable) return;
    setCounter(prev => prev + 1);
  }

  function grabMinHand(e) {
    setMinDraggable(true);
    clearInterval(counterRef.current);
    minArrowRef.current.style.zIndex = 2;
    secArrowRef.current.style.zIndex = 1;
  }

  function moveMinHand(e) {
    if (!isMinDraggable) return;
    setCounter(prev => prev + 60);
  }

  // input box functions

  function isValid(num) {
    return num >= 0 || num < 60 ? true : false;
  }

  function onMinChange(e) {
    const val = Number(e.target.value);
    if (!isValid(val)) {
      console.log("Invalid Number");
      return;
    }
    setMin(val);
    const currSec = counter % 60;
    setCounter(currSec + val * 60);
  }

  function onSecChange(e) {
    const val = Number(e.target.value);
    if (!isValid(val)) {
      console.log("Invalid Number");
      return;
    }
    setSec(val);
    const currMin = Math.floor(counter / 60);
    setCounter(currMin * 60 + val);
  }

  function stopCounter() {
    clearInterval(counterRef.current);
  }

  return (
    <>
      <div className="clock-wrapper" ref={clockWrapperRef}>
        <div className="draggable-clock-container">
          <Hand
            name={"minute-hand"}
            handRef={minArrowRef}
            grabHand={grabMinHand}
            moveHand={moveMinHand}
          />
          <Hand
            name={"second-hand"}
            handRef={secArrowRef}
            grabHand={grabSecHand}
            moveHand={moveSecHand}
          />
        </div>
      </div>
      <div className="input-container">
        <input
          type="number"
          className="minutes-input"
          value={min}
          onFocus={stopCounter}
          onChange={onMinChange}
          onBlur={startCounter}
        />
        <input
          type="number"
          className="seconds-input"
          value={sec}
          onFocus={stopCounter}
          onChange={onSecChange}
          onBlur={startCounter}
        />
      </div>
    </>
  );
}
