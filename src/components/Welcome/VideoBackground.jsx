import React from "react";
import "./VideoBackground.css"; // Assuming you store your CSS here

export const VideoBackground = () => {
  return (
    <video autoPlay muted loop className="backgroundVideo">
      <source src="../../assets/RevisedSkyScene.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
