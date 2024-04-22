import React from 'react';
import { TextBubble } from './TextBubble';
import backgroundImage from '../../assets/RevisedSkyScene.png'

export const Welcome = () => {
    const text = "What's up champ?\\n\\nNames Cassidy Cloud, and I'm gonna take you to the top.\\n\\nIf there's two things I know in this world it's YOUR disc golf game, and of course good old mother nature.\\n\\nIt's my job to let you know how she's been affecting your scores. With my help, she'll never get the best of you again....\\n\\nI Guarantee it.";

    const backgroundStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',       // Ensure the background covers the entire component
      backgroundPosition: 'center',  // Center the background image
      backgroundRepeat: 'no-repeat', // Do not repeat the image
      height: '100vh',               // Full viewport height
      width: '100vw'                 // Full viewport width
  };



  return (
    <div style={backgroundStyle}>
      <TextBubble text={text} />
    </div>
  );
}


