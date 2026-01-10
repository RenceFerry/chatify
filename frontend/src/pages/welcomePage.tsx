import welcomeImages from "../utils/welcomeImages"
import { useState, useRef } from "react"
import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

export const WelcomePage = () => {
  localStorage.setItem('firstVisit', 'false');
  const [ index, setIndex ] = useState(0);
  const startX = useRef(0);

  const next = () => setIndex((prev) => (prev+1) % welcomeImages.length);
  const prev = () => setIndex((prev) => ((prev-1) + welcomeImages.length) % welcomeImages.length);

  const handleStartTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
  }

  const handleEntTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX.current > 50) prev();
    if (startX.current - endX > 50) next();
  }


  return (
    <div className='w-full h-full flex flex-col justify-evenly items-center relative bg-blueA overflow-hidden'>

      {/** background */}
      <div className="w-full flex flex-row justify-center">
        <div className="absolute bg-back w-[200%] rounded-[100%] h-screen z-10 bottom-[40%] border-50 border-wA"></div>
      </div>

      {/** carousel */}
      <div 
        className="flex flex-row flex-[60%] w-full overflow-hidden items-center gap-3 z-20"
        onTouchStart={handleStartTouch}
        onTouchEnd={handleEntTouch}
      >
        <div className=
          'flex flex-row w-full h-full transition-all duration-500'
          style={{ transform: `translateX(-${index * 100}%)`}}
        >
          {
            welcomeImages.map((image, i) => (
              <div key={i} className="h-full flex flex-col carousel items-center justify-center gap-10">
                <img src={image.url} alt={image.title} className="w-[60%] max-w-[500px]"/>

                <div className="flex flex-col justify-center items-center text-blueD gap-2">
                  <h1 className="text-3xl font-semibold">{image.title}</h1>
                  <p className="text-xl font-regular text-center px-3">{image.sub}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/** get started */}
      <div className="flex-[40%] flex flex-col justify-around items-center gap-4 w-full">
          <Link className="bg-blueC flex justify-center items-center h-14 w-5/6 max-w-96 font-semibold text-back text-2xl rounded-xl" to="/auth/login">Get started</Link>

          <div className="flex flex-row justify-around w-full items-center font-regular">
            <button type="button" title="prev" className="grid items-center h-16 w-16 rounded-full text-xl text-blueC" onClick={prev}>Prev</button>

            <div className="flex flex-row items-center justify-center gap-3">
              {
                welcomeImages.map((_, i) => (
                  <div key={i} className={clsx(
                    "h-3 w-3 rounded-full",
                    index === i ? "bg-blueC" : "bg-blueB"
                  )} onClick={() => setIndex(i)}></div>
                ))
              }
            </div>

            <button type="button" title="next" className="flex justify-center items-center h-16 w-16 rounded-full text-blueD text-xl bg-blueB" onClick={next}>next</button>
          </div>
      </div>
    </div>
  )
}
