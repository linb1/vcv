import { Network } from "lucide-react";
import React from "react";

const Overlay = () => {
  return (
    <div className="fixed h-screen w-1/5 min-w-60 bg-white shadow-md border border-slate-300">
      <div className="flex flex-col justify-center items-center gap-10 px-5 py-20">
        <Network className="w-20 h-20" />
        <h1 className="text-center text-3xl">Version Control Visualizer</h1>

        <div>
          This application can help visualize a version control by adding nodes
          to the history. Interact with the nodes and comments to see how it
          works!
        </div>

        <div>
          <div>Instructions:</div>
          <ul className="list-disc px-5">
            <li>Drag to move around</li>
            <li>Hover over a node to see the path to the original node</li>
            <li>Click a node to open up the modal</li>
            <li>Add a new node to the current node using the modal</li>
            <li>
              Add, edit, and view comments for the current node using the modal
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
