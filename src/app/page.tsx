'use client'

import { useEffect, useRef, useState } from "react";
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

  const [animatingCards, setAnimatingCards] = useState<number[]>([]);

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
    const resetArray = [...cardArray]

    resetArray.forEach(card => {
      card.numberOfClicks = 0
      card.timeOfFirstClick = null
    });

    // Sort by main number
    const sorted = resetArray.sort((a, b) => a.mainNumber - b.mainNumber);

    animateClearArray()

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

    setCardArray(sorted)
  }

  //Sorting functions
  const sortByClicks = (descending : boolean = true) => {
    const oldArray = [...cardArray];

    const sorted = [...cardArray].sort((a, b) => {
      return descending ? b.numberOfClicks - a.numberOfClicks : a.numberOfClicks - b.numberOfClicks;
    });

    animateShuffleToNewArray(oldArray,sorted);
  }

  const sortByFirstClick = (cards : CardData[], sortByFirst : boolean = true) => {
    const oldArray = [...cardArray];
    const sorted = [...cards].sort((a, b) => {
      const aTime = a.timeOfFirstClick ? new Date(a.timeOfFirstClick).getTime() : (sortByFirst ? Infinity : -Infinity);
      const bTime = b.timeOfFirstClick ? new Date(b.timeOfFirstClick).getTime() : (sortByFirst ? Infinity : -Infinity);

      return sortByFirst ? aTime - bTime : bTime - aTime;
    });
    
    animateShuffleToNewArray(oldArray,sorted)
  }

  //Styling functions
  const toggleLightMode = ()=>{
    document.body.classList.toggle('dark');
  }

  // Not only animates but also sets the card Array as well!
  const animateShuffleToNewArray = async (sourceArray : CardData[], targetArray : CardData[]) => {
    //Turn the old array into the new array with animations
    for (let i = 0; i < targetArray.length; i++){
      // Since it's two different cards we need to swap
      if (targetArray[i].mainNumber !== sourceArray[i].mainNumber){
        let targetIndex = sourceArray.findIndex(card => card.mainNumber === targetArray[i].mainNumber);

        setAnimatingCards([sourceArray[i].mainNumber,sourceArray[targetIndex].mainNumber]);

        await new Promise(r=> setTimeout(r,400)); // Ensures that transitions trigger properly for 2nd card being swapped with

        [sourceArray[i], sourceArray[targetIndex]] = [sourceArray[targetIndex], sourceArray[i]];
        setCardArray([...sourceArray]);
        
        await new Promise(r=> setTimeout(r,400)); // Ensures transitions trigger properly for 2nd card on way out

        setAnimatingCards([]);

        await new Promise(r=> setTimeout(r,400)); // Time in between cards so nothing happens too fast
      }
    }
  }

  // Completely clears the array
  const animateClearArray = async () => {
    setAnimatingCards(cardArray.map((card) => card.mainNumber));

    await new Promise(r => setTimeout(r,400));

    setAnimatingCards([]);
  }

  //Page
  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <main>
        <button className=" absolute top-2 left-2 bg-white w-15 h-15 rounded-full hover:scale-105 hover:bg-gray-200 card border-black border-2 component" onClick={toggleLightMode}></button>
        <h1 className="text-6xl font-bold pb-10"> Card Counter!</h1>
        <div className="grid grid-cols-4 grid-rows-2 gap-8">
          {cardArray.map((card) => (
            <Card key={card.mainNumber} card={card} onUpdate={handleCardUpdate} isAnimating={animatingCards.includes(card.mainNumber)}/>
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
