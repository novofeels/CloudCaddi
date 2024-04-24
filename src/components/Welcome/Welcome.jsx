import React from 'react';
import { TextBubble } from './TextBubble';
import './Welcome.css'; // Import the CSS stylesheet

export const Welcome = () => {
    const text = "What's up champ?\\n\\nNames Cassidy Cloud, and I'm gonna take you to the top.\\n\\nIf there's two things I know in this world it's YOUR disc golf game, and of course good old mother nature.\\n\\nIt's my job to let you know how she's been affecting your scores. With my help, she'll never get the best of you again....\\n\\nI Guarantee it.";

    return (
      <div className="welcome-container">
        <TextBubble text={text} />
      </div>
    );
}


