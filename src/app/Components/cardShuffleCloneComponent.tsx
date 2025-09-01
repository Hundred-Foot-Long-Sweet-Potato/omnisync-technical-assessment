import { useEffect, useState } from "react";
import { CardData } from "../types/card";

export interface Vector2 {
    x: number,
    y: number,
}

export interface CloneProps {
    cardNumber: number;
    start: Vector2;
    end: Vector2;
    duration: number;
    isVisible : boolean;
}

export default function CardShuffleClone({cardNumber, isVisible,start,end,duration}: CloneProps) {
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
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">{cardNumber}</h1>
    </div>
    );
}