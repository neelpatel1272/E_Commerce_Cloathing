import React, { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      setClicked(true);
    };

    const handleMouseUp = () => {
      setClicked(false);
    };

    const animate = () => {
      // Outer circle
      cursor.current.x +=
        (mouse.current.x - cursor.current.x) * 0.12;

      cursor.current.y +=
        (mouse.current.y - cursor.current.y) * 0.12;

      // Inner dot follows the actual cursor faster
      dot.current.x +=
        (mouse.current.x - dot.current.x) * 0.3;

      dot.current.y +=
        (mouse.current.y - dot.current.y) * 0.3;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `
          translate3d(
            ${cursor.current.x}px,
            ${cursor.current.y}px,
            0
          ) translate(-50%, -50%)
        `;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate3d(
            ${dot.current.x}px,
            ${dot.current.y}px,
            0
          ) translate(-50%, -50%)
        `;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${clicked ? "clicked" : ""}`}
      />

      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
};

export default CustomCursor;