import { useEffect, useState } from "react";

export interface CardData {
    mainNumber: number;
    numberOfClicks: number;
    timeOfFirstClick: number | null;
}

export interface CardProps {
    card: CardData;
    onUpdate: (updatedCard: CardData) => void;
}

export default function Card({card, onUpdate}: CardProps) {
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

        const data = await res.json();
        onUpdate(data);
    }

    // Mainly for reset from parent as it changes these 2 values.
    useEffect(() => {
        setClickCount(card.numberOfClicks);
        setFirstClickTime(card.timeOfFirstClick ? new Date(card.timeOfFirstClick) : null);
    }, [card.numberOfClicks, card.timeOfFirstClick]);

    return(
    <div className="w-48 h-32 flex flex-col bg-white text-2xl justify-center items-center font-bold"
        onClick={() => handleClick()}>
        <h1 className="text-black">{card.mainNumber}</h1>
        <div>
            <h2 className="text-sm text-gray-500">Clicks: {clickCount}</h2>
            <h2 className="text-sm text-gray-500">First Click: {firstClickTime ? firstClickTime.toLocaleTimeString() : 'N/A'}</h2>
        </div>
    </div>);
}