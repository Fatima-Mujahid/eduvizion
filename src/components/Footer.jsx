import React from "react";
import { love } from "../assets";

const Footer = () => {
  return (
    <div className="mb-4">
      Made with &nbsp;
      <img
        src={love}
        alt="Love"
        className="inline h-4 w-4 object-contain mt-[-4px]"
      />
      &nbsp; by TechMinds
    </div>
  );
};

export { Footer };
