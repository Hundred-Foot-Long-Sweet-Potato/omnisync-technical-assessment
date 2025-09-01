'use client'

import { useEffect, useRef, useState } from "react";
import Card from "./Components/cardComponent";
import { CardData } from "./types/card";
import CardShuffleClone, { CloneProps } from "./Components/cardShuffleCloneComponent";

// Home page
export default function CardCounting() {
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

  const [cloneArray, setClones] = useState<CloneProps[]>([
    {cardNumber: 1,start:{x: 0, y:0}, end:{x:0,y:0},duration: 300,  isVisible: false},
    {cardNumber: 2,start:{x: 0, y:0}, end:{x:0,y:0},duration: 300,  isVisible: false},
  ])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [animatingCards, setAnimatingCards] = useState<number[]>([]);

  //#region Managing CardArray Logic
  useEffect(() => {
    const fetchOrInitializeCards = async () => {
      const res = await fetch('/api/cards');
      let data: CardData[] = await res.json();

      // Nothing in data means first time load
      if (data.length === 0) {
        for (const card of cardArray) {
          await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(card),
          }).then(res => {
            // Now what the hell do I do here if this even fails??? Probably display some sort of error screen?
            if (!res.ok) throw new Error(`Failed to create Card! status: ${res.status}`);
          });
        }
      }else{
        // OnLoad sorts by first click time
        data = data.sort((a, b) => a.mainNumber - b.mainNumber);
        setCardArray(data);
        animateOnLoad(data);
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
  //#endregion

  //#region Sorting functions
  const resetCards = async () => {
    const resetArray : CardData[] = [...cardArray]

    resetArray.forEach(card => {
      card.numberOfClicks = 0
      card.timeOfFirstClick = null
    });

    // Sort by main number
    const sorted = resetArray.sort((a, b) => a.mainNumber - b.mainNumber);

    animateClearArray();

    setCardArray(sorted);

    // Reset all cards on server
    for (const card of cardArray) {
      await fetch('/api/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainNumber: card.mainNumber,
          numberOfClicks: 0,
          timeOfFirstClick: null
        }),
      }).then(res => {
        if (!res.ok) throw new Error(`Failed to reset card value! status: ${res.status}`);
      });

    }
  }

  //Sort by number of clicks, most or least.
  const sortByClicks = (descending : boolean = true) => {
    const oldArray : CardData[] = [...cardArray];

    const sorted = [...cardArray].sort((a, b) => {
      return descending ? b.numberOfClicks - a.numberOfClicks : a.numberOfClicks - b.numberOfClicks;
    });

    animateShuffleToNewArray(oldArray,sorted);
  }

  //Sort by time of click, first or last.
  const sortByFirstClick = (cards : CardData[], sortByFirst : boolean = true) => {
    const oldArray = [...cards];
    const sorted = [...cards].sort((a, b) => {
      const aTime = a.timeOfFirstClick ? new Date(a.timeOfFirstClick).getTime() : (sortByFirst ? Infinity : -Infinity);
      const bTime = b.timeOfFirstClick ? new Date(b.timeOfFirstClick).getTime() : (sortByFirst ? Infinity : -Infinity);

      return sortByFirst ? aTime - bTime : bTime - aTime;
    });
    
    animateShuffleToNewArray(oldArray,sorted);
  }
  //#endregion

  //#region Styling functions

  const toggleLightMode = ()=>{
    document.body.classList.toggle('dark');
  }

  /**
   * Animates with scale down then up on 2 cards at a time. Slowly replaces the cardArray with
   * the target array with each animation 1 at a time.
   * @param sourceArray - The original location of the cards
   * @param targetArray - The end result that the source Array will morph into
   * @return cardArray replaced with the target Array at the end
   */
  const animateShuffleToNewArray = async (sourceArray : CardData[], targetArray : CardData[]) => {
    //Turn the old array into the new array with animations
    for (let i = 0; i < targetArray.length; i++){
      // Since it's two different cards we need to swap
      if (targetArray[i].mainNumber !== sourceArray[i].mainNumber){
        let targetIndex = sourceArray.findIndex(card => card.mainNumber === targetArray[i].mainNumber);

        setAnimatingCards([sourceArray[i].mainNumber,sourceArray[targetIndex].mainNumber]);
        shuffleTwoCards(sourceArray[i], sourceArray[targetIndex], sourceArray);

        await new Promise(r=> setTimeout(r,400)); // Ensures that transitions trigger properly for 2nd card being swapped with

        [sourceArray[i], sourceArray[targetIndex]] = [sourceArray[targetIndex], sourceArray[i]];
        setCardArray([...sourceArray]);
        
        await new Promise(r=> setTimeout(r,400)); // Ensures transitions trigger properly for 2nd card on way out

        setAnimatingCards([]);

        await new Promise(r=> setTimeout(r,400)); // Time in between cards so nothing happens too fast
      }
    }
  }

  const shuffleTwoCards = async (card1 : CardData, card2 : CardData, array: CardData[]) => {
    if (!cardRefs.current) return;

    const cardElements = cardRefs.current.filter((el) : el is HTMLDivElement => el !== null);

    const rect1 = (cardElements[array.findIndex((card) => card.mainNumber == card1.mainNumber)] as HTMLElement).getBoundingClientRect();
    const rect2 = (cardElements[array.findIndex((card) => card.mainNumber == card2.mainNumber)] as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();

    const start1 = { x: rect1.left - containerRect.left, y: rect1.top - containerRect.top };
    const start2 = { x: rect2.left - containerRect.left, y: rect2.top - containerRect.top };

    setClones([
      {cardNumber: card1.mainNumber,start: start1, end: start2, duration: 800, isVisible: true },
      {cardNumber: card2.mainNumber,start: start2, end: start1, duration: 800, isVisible: true },
    ]);

    //Invisible our clones and visible our normal cards
    setTimeout(() => {
      setClones((clones) => clones.map((clone) => ({ ...clone, isVisible: false })));
    },1150)
  };

  /**
   * Inflicts animating state on all cards. This calls all to scale down then up at the same time.
   * Unlike animateShuffleToNewArray, this function does NOT affect cardArray.
   */
  const animateClearArray = async () => {
    setAnimatingCards(cardArray.map((card) => card.mainNumber));

    await new Promise(r => setTimeout(r,400));

    setAnimatingCards([]);
  }

  const animateOnLoad = async (array : CardData[]) => {
    animateClearArray()

    await new Promise(r => setTimeout(r,800));

    sortByFirstClick(array,true);
  }
  //#endregion

  //Page
  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <main>
        <button className=" absolute top-2 left-2 bg-white w-15 h-15 rounded-full hover:scale-105 hover:bg-gray-200 card border-black border-2 component " onClick={toggleLightMode}>toggle light</button>
        <h1 className="text-6xl font-bold pb-10"> Card Counter!</h1>
        <div className="grid grid-cols-4 grid-rows-2 gap-8" ref={containerRef}>
          {cardArray.map((card,index) => (
            <Card ref={(ele) => {cardRefs.current[index] = ele} } key={card.mainNumber} card={card} onUpdate={handleCardUpdate} isAnimating={animatingCards.includes(card.mainNumber)}/>
          ))}

          {cloneArray.map((clone) => (
            <CardShuffleClone key={clone.cardNumber} cardNumber={clone.cardNumber} start={clone.start} end={clone.end} duration={clone.duration} isVisible={clone.isVisible} />
          ))}
        </div>
        <div className="pt-10 flex justify-center gap-4 ">
          <button className="h-10 w-20 bg-white text-black border-2 border-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={resetCards}>Reset</button>
        </div>
        <div className="pt-10 flex justify-center gap-4 ">
          <button className="h-10 w-40 bg-white text-black border-2 border-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByClicks(true)}>Sort by Most Clicks</button>
          <button className="h-10 w-40 bg-white text-black border-2 border-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByFirstClick(cardArray,true)}>Sort by First Click</button>
        </div>
        <div className="pt-10 flex justify-center gap-4">
          <button className="h-10 w-40 bg-white text-black border-2 border-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByClicks(false)}>Sort by Least Clicks</button>
          <button className="h-10 w-40 bg-white text-black border-2 border-black rounded hover:scale-105 hover:bg-gray-200 component" onClick={() => sortByFirstClick(cardArray,false)}>Sort by Last Click</button>
        </div>
      </main>
    </div>
  );
}
