import { useEffect, useState } from "react";
import { getAllHoles } from "../../services/HoleService";

export const Hole = () => {
    const [holes, setHoles] = useState([]);

    useEffect(() => {
        getAllHoles().then(holeObjs => setHoles(holeObjs));
    }, []);

    return (
        <div>
            {holes.map((hole, index) => (
                <div key={index}>
                    <h2>Hole {hole.holeNumber}</h2>
                    <p>Par: {hole.par}</p>
                    <p>Distance: {hole.distance}</p>
                    <img src={hole.image} alt={`Hole ${hole.holeNumber}`} />
                </div>
            ))}
        </div>
    );
};
