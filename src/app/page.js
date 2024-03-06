"use client";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [canvasElements, setCanvasElements] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);

  useEffect(() => {
    console.log(canvasElements);
  }, [canvasElements]);

  return (
    <main className="flex h-screen">
      <Elements setDraggedElement={setDraggedElement} />
      <section className="w-full bg-sky-50 p-4">
        <Canvas
          canvasElements={canvasElements}
          setCanvasElements={setCanvasElements}
          draggedElement={draggedElement}
          setDraggedElement={setDraggedElement}
        />
      </section>
    </main>
  );
}

function Canvas({
  canvasElements,
  setCanvasElements,
  draggedElement,
  setDraggedElement,
}) {
  const canvasRef = useRef();
  const [dropTarget, setDropTarget] = useState(null);

  const getClosestElement = (e) => {
    let minDistanceY = Infinity;
    let minDistanceX = Infinity;
    let closestElement = null;

    const elements = canvasRef.current.querySelectorAll(".element");

    elements.forEach((element) => {
      const elementRect = element.getBoundingClientRect();

      const centerX = elementRect.left + elementRect.width / 2;
      const centerY = elementRect.top + elementRect.height / 2;

      const distanceX = Math.abs(e.clientX - centerX);
      const distanceY = Math.abs(e.clientY - centerY);

      if (
        distanceY < minDistanceY ||
        (distanceY === minDistanceY && distanceX < minDistanceX)
      ) {
        minDistanceY = distanceY;
        minDistanceX = distanceX;
        closestElement = element;
      }
    });

    return closestElement;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (canvasElements.length <= 0) {
      setDropTarget(e.target);
    } else {
      const foundElement = getClosestElement(e);
      setDropTarget(foundElement);
    }
  };

  const handleDrop = (e) => {
    console.log(e.target, dropTarget);
    const dropTargetIndex = parseInt(dropTarget.id);

    if (draggedElement.from === "sidebar") {
      setCanvasElements((prevCanvasElements) => {
        const newCanvasElements = [...prevCanvasElements];
        newCanvasElements.splice(dropTargetIndex + 1, 0, {
          ...draggedElement,
          id: dropTargetIndex + 1,
        });

        return newCanvasElements.map((element, index) => ({
          ...element,
          id: index,
        }));
      });
    } else {
      setCanvasElements((prevCanvasElements) => {
        const withoutDraggedElement = prevCanvasElements.filter(
          (_, index) => index !== draggedElement.id
        );
        const newCanvasElements = [
          ...withoutDraggedElement.slice(0, dropTargetIndex + 1),
          draggedElement,
          ...withoutDraggedElement.slice(dropTargetIndex + 1),
        ];

        return newCanvasElements.map((element, index) => ({
          ...element,
          id: index,
        }));
      });
    }
  };

  const handleElementDragStart = (e, canvasElement) => {
    canvasElement.from = "canvas";
    setDraggedElement(canvasElement);
  };
  const handleElementDragEnd = (e) => {
    setDraggedElement({});
  };

  return (
    <>
      <div
        className="bg-white p-4 h-full border border-gray-300 rounded-md"
        ref={canvasRef}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}
      >
        {canvasElements &&
          canvasElements.map((canvasElement, index) => {
            const CanvasElement = canvasElement.name;
            return (
              <CanvasElement
                draggable={true}
                onDragStart={(e) => handleElementDragStart(e, canvasElement)}
                onDragEnd={(e) => handleElementDragEnd(e)}
                key={index}
                id={index}
                className="border element"
              >
                {canvasElement.name}
                {canvasElement.children && (
                  <Canvas
                    canvasElements={canvasElement.children}
                    setCanvasElements={setCanvasElements}
                  />
                )}
              </CanvasElement>
            );
          })}
      </div>
    </>
  );
}

function Elements({ setDraggedElement }) {
  const elements = [
    {
      name: "h1",
    },
    {
      name: "p",
    },
    {
      name: "button",
    },
    {
      name: "span",
    },
    {
      name: "div",
    },
  ];

  const handleDragStart = (e, element) => {
    element.from = "sidebar";
    setDraggedElement(element);
  };

  return (
    <section className="w-[15%] space-y-4 p-4 border-r border-gray-300">
      <h2 className="text-xl font-black drop">Elements</h2>
      <div className="space-y-4">
        {elements.map((element, index) => (
          <div
            key={index}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, element)}
            className="p-4 border border-gray-300 rounded-md cursor-move"
          >
            {element.name}
          </div>
        ))}
      </div>
    </section>
  );
}
