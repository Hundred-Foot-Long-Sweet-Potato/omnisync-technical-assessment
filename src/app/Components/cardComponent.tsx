import { forwardRef, useEffect, useState } from "react";
import { CardData } from "../types/card";

export interface CardProps {
    card: CardData;
    onUpdate: (updatedCard: CardData) => void;
    isAnimating : boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({card, isAnimating, onUpdate},ref) => {
    const [clickCount, setClickCount] = useState<number>(0);
    const [firstClickTime, setFirstClickTime] = useState<Date | null>(null);

    const handleClick = async () => {
        let newFirstClickTime = firstClickTime;

        if (clickCount === 0) {
            newFirstClickTime = new Date();
            setFirstClickTime(newFirstClickTime);
        }

        const updatedCount = clickCount + 1;
        setClickCount(updatedCount);

        //Update server
        const res = await fetch('/api/cards', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                mainNumber: card.mainNumber,
                numberOfClicks: updatedCount,
                timeOfFirstClick: newFirstClickTime,
            }),
        });
        
        if (!res.ok) throw new Error(`Failed to update Card! status: ${res.status}`);

        const data = await res.json();

        onUpdate(data);
    }

    // Mainly for reset and onLoad
    useEffect(() => {
        setClickCount(card.numberOfClicks);
        setFirstClickTime(card.timeOfFirstClick ? new Date(card.timeOfFirstClick) : null);
    }, [isAnimating]);

    return(
    <div ref = {ref} className={`w-64 h-40 bg-white text-2xl relative flex justify-center items-center font-bold rounded border-2 border-black component
        ${isAnimating ? "opacity-0 transition-none" : "opacity-100 transition-none"}
        transform !transition-all !duration-300 ease-in-out
        hover:scale-105 hover:rotate-1
        active:scale-110 active:-rotate-2`}
        onClick={() => handleClick()}>
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">{card.mainNumber}</h1>
        <div className="absolute bottom-2 left-2 right-2 flex flex-row justify-between text-xs text-gray-500">
            <h2>Clicks: {clickCount}</h2>
            <h2>First Click: {firstClickTime ? firstClickTime.toLocaleTimeString() : 'N/A'}</h2>
        </div>
    </div>
    );
}
);

Card.displayName = "Card";

export default Card;