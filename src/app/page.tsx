'use client'

import { useEffect, useState } from "react";
import Card, { CardData } from "./Components/cardComponent";

// Home page
export default function Home() {
  //Defaults
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
      const res = await fetch('/api/cards');
      const data: CardData[] = await res.json();

      // Nothing in data means first time load
      if (data.length === 0) {
        for (const card of cardArray) {
          await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(card),
          });
        }
      }else{
        // OnLoad sorts by first click time
        sortByFirstClick(data,true);
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

    // Reset all cards on server
    for (const card of cardArray) {
      const res = await fetch('/api/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainNumber: card.mainNumber,
          numberOfClicks: 0,
          timeOfFirstClick: null
        }),
      });
      const data = await res.json();
      handleCardUpdate(data);
    }

    // Reset all cards Locally
    const resetArray = cardArray.map(card => ({
      ...card,
      numberOfClicks: 0,
      timeOfFirstClick: null
    }));

    // Sort by main number
    const sorted = resetArray.sort((a, b) => a.mainNumber - b.mainNumber);
    setCardArray(sorted);
  }

  //Sorting functions
  const sortByClicks = (descending : boolean = true) => {
    const sorted = [...cardArray].sort((a, b) => {
      return descending ? b.numberOfClicks - a.numberOfClicks : a.numberOfClicks - b.numberOfClicks;
    });
    setCardArray(sorted);
  }

  const sortByFirstClick = (cards : CardData[], sortByFirst : boolean = true) => {
    const sorted = [...cards].sort((a, b) => {
      const aTime = a.timeOfFirstClick ? new Date(a.timeOfFirstClick).getTime() : (sortByFirst ? Infinity : -Infinity);
      const bTime = b.timeOfFirstClick ? new Date(b.timeOfFirstClick).getTime() : (sortByFirst ? Infinity : -Infinity);

      return sortByFirst ? aTime - bTime : bTime - aTime;
    });
    setCardArray(sorted);
  }

  //Styling functions
  const toggleLightMode = ()=>{
    document.body.classList.toggle('dark');
  }

  //Page
  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <main>
        <button className=" absolute top-2 left-2 bg-white w-15 h-15 rounded-full hover:scale-105 hover:bg-gray-200 card border-black border-2 component" onClick={toggleLightMode}></button>
        <h1 className="text-6xl font-bold pb-10"> Card Counter!</h1>
        <div className="grid grid-cols-4 grid-rows-2 gap-8">
          {cardArray.map((card) => (
            <Card key={card.mainNumber} card={card} onUpdate={handleCardUpdate}/>
          ))}
        </div>
        <div className="pt-10 flex justify-center gap-4 ">
          <button className="h-10 w-20 bg-white text-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={resetCards}>Reset</button>
        </div>
        <div className="pt-10 flex justify-center gap-4 ">
          <button className="h-10 w-40 bg-white text-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByClicks(true)}>Sort by Most Clicks</button>
          <button className="h-10 w-40 bg-white text-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByFirstClick(cardArray,true)}>Sort by First Click</button>
        </div>
        <div className="pt-10 flex justify-center gap-4">
          <button className="h-10 w-40 bg-white text-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByClicks(false)}>Sort by Least Clicks</button>
          <button className="h-10 w-40 bg-white text-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByFirstClick(cardArray,false)}>Sort by Last Click</button>
        </div>
      </main>
    </div>
  );
}
