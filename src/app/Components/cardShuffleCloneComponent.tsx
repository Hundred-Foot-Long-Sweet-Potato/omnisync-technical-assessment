import { useEffect, useState } from "react";
import { CardData } from "../types/card";

export interface Vector2 {
    x: number,
    y: number,
}

export interface CloneProps {
    cardData : CardData
    start: Vector2;
    end: Vector2;
    duration: number;
    isVisible : boolean;
}

/**
 * Clone component. This visually looks exactly the same as the card Component but is only used for visuals 
 * during animations. Needs all information from previous card to pretend to be it and then animation variables.
 */
export default function CardShuffleClone({cardData, isVisible,start,end,duration}: CloneProps) {
    const [position, setPosition] = useState<Vector2>(start);

    //Use effect when it's visible
    useEffect(() => {
        const startTime = performance.now()

        const animate = (time : number) => {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1);
            
            setPosition({
                x: start.x + (end.x - start.x) * t,
                y: start.y + (end.y - start.y) * t,
            });

            if (t < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [start,end,duration]);

    return(
    <div className={`w-64 h-40 bg-white text-2xl absolute flex justify-center items-center font-bold rounded border-2 border-black component pointer-events-none
        ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{transform:`translate(${position.x}px, ${position.y}px)`}}
        >
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">{cardData.mainNumber}</h1>
        <div className="absolute bottom-2 left-2 right-2 flex flex-row justify-between text-xs text-gray-500">
            <h2>Clicks: {cardData.numberOfClicks}</h2>
            <h2>First Click: {cardData.timeOfFirstClick ? new Date(cardData.timeOfFirstClick).toLocaleTimeString(): 'N/A'}</h2>
        </div>
    </div>
    );
}