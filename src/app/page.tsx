'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import Card, { CardData } from "./Components/cardComponent";

// Home page
export default function Home() {
  const [cardArray,setCardArray] = useState<CardData[]>([
    { mainNumber: 1, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 2, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 3, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 4, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 5, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 6, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 7, numberOfClicks: 0, timeOfFirstClick: null },
    { mainNumber: 8, numberOfClicks: 0, timeOfFirstClick: null },
  ]);

  useEffect(() => {
    const fetchOrInitializeCards = async () => {
      console.log("Fetching cards from server...");
      const res = await fetch('/api/cards');
      const data: CardData[] = await res.json();

      // Nothing in data means first time load
      if (data.length === 0) {
        console.log("No cards found on server, initializing...");
        for (const card of cardArray) {
          const res = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mainNumber: card.mainNumber,
              numberOfClicks: 0,
              timeOfFirstClick: null
            }),
          });
          const createdCard = await res.json();
          console.log("Created card:", createdCard);
        }
      }else{
        // Sort the data by mainNumber to ensure correct order
        data.sort((a, b) => a.mainNumber - b.mainNumber);
        setCardArray(data);
      }
    }

    fetchOrInitializeCards();
  }, []);

  //Update card in array. Mainly for sorting functions later
  const handleCardUpdate = (updatedCard: CardData) => {
    setCardArray((prevCards) =>
      prevCards.map((card) =>
        card.mainNumber === updatedCard.mainNumber ? updatedCard : card
      )
    );
  }

  const resetCards = async () => {
  }


  //Page
  return (
    <div className="min-h-screen flex justify-center items-center">
      <main>
        <h1 className="text-6xl font-bold pb-10"> Card Counter!</h1>
        <div className="grid grid-cols-4 grid-rows-2 gap-8">
          {cardArray.map((card) => (
            <Card key={card.mainNumber} card={card} onUpdate={handleCardUpdate}/>
          ))}
        </div>
        <div className="pt-10 flex justify-center gap-4">
          <button className="h-10 w-20 bg-white text-black" onClick={resetCards}>Reset</button>
        </div>
      </main>
    </div>
  );
}
