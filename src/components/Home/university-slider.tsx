"use client";

import React, { useEffect, useRef, useState } from 'react';

const UniversitySlider = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with center item active
  const carouselRef = useRef(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const carouselItems = [
    {
      name: "Anthony Lee",
      title: "Archetypal Professor of Recognition",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&h=720&q=80"
    },
    {
      name: "Alicia Chevalier",
      title: "Corporate Usability Analyst",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&h=720&q=80"
    },
    {
      name: "Nate Boucher",
      title: "Customer Impact Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&h=720&q=80"
    },
    {
      name: "Leah Harris",
      title: "Designer and Bandit",
      image: "https://images.unsplash.com/photo-1614204424926-196a80bf0be8?fit=crop&h=720&q=80"
    },
    {
      name: "Angelina Laurent",
      title: "Oracle for Inspiration",
      image: "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?fit=crop&h=720&q=80"
    },
    {
      name: "Gal Gadot",
      title: "Acting Designer and Consultant",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&h=720&q=80"
    },
    {
      name: "Albert Sørensen",
      title: "Neural Big Shot of Anticipation",
      image: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?fit=crop&h=720&q=80"
    },
    {
      name: "Candice Marchand",
      title: "Mindful Realist of Motion Laws",
      image: "https://images.unsplash.com/photo-1553514029-1318c9127859?fit=crop&h=720&q=80"
    },
    {
      name: "Jennifer Salazar",
      title: "Design Habitué",
      image: "https://images.unsplash.com/photo-1596813362035-3edcff0c2487?fit=crop&h=720&q=80"
    },
    {
      name: "Antonin Dufour",
      title: "Human-Centered Designer",
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?fit=crop&h=720&q=80"
    },
    {
      name: "Melissa Simon",
      title: "International Infrastructure Analyst",
      image: "https://images.unsplash.com/photo-1530785602389-07594beb8b73?fit=crop&h=720&q=80"
    },
    {
      name: "Brandon Murray",
      title: "Central Functionality VP",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&h=720&q=80"
    }
  ];

  const visibleItems = 5;
  const centerIndex = Math.floor(visibleItems / 2);

  const getDisplayItems = () => {
    const totalItems = carouselItems.length;
    let displayItems: Array<{name: string; title: string; image: string}> = []; // Add type annotation
      
    // Calculate the range of indices to display
    for (let i = -centerIndex; i <= centerIndex; i++) {
      let index = (activeIndex + i + totalItems) % totalItems;
      displayItems.push(carouselItems[index]);
    }
    
    return displayItems;
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + carouselItems.length) % carouselItems.length);
    resetAutoSlide();
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % carouselItems.length);
    resetAutoSlide();
  };

const resetAutoSlide = () => {
  if (autoRef.current) {
    clearInterval(autoRef.current);
  }
  autoRef.current = setInterval(handleNext, 3000);
};

// In your useEffect:
useEffect(() => {
  autoRef.current = setInterval(handleNext, 3000);
  return () => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
    }
  };
}, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={carouselRef}
        className="flex items-center justify-center gap-4 p-4 h-[70vh]" // Set fixed height here
      >
        {getDisplayItems().map((item, index) => {
          const isActive = index === centerIndex;
          const itemIndex = (activeIndex - centerIndex + index + carouselItems.length) % carouselItems.length;
          
          return (
            <div
              key={`${itemIndex}-${item.name}`}
              className={`
                relative transition-all duration-500 ease-in-out
                ${isActive ? 'w-[450px]' : 'w-32'}
                h-full // All items take full height of container
                rounded-xl overflow-hidden shadow-lg
                ${isActive ? 'z-10' : 'z-0'}
                bg-card/20
              `}
              onClick={() => {
                setActiveIndex(itemIndex);
                resetAutoSlide();
              }}
              tabIndex={0}
            >
              <img
                src={item.image}
                alt={item.name}
                className={`
                  absolute inset-0 w-full h-full object-cover
                  ${isActive ? 'saturate-100 contrast-100 brightness-100' : 'saturate-20 contrast-75 brightness-110'}
                `}
              />
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h2 className="text-white text-2xl font-semibold tracking-wide">
                    {item.name}
                  </h2>
                  <h3 className="font-mono text-xs tracking-wider font-medium uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    {item.title}
                  </h3>
                </div>
              )}
              <div className={`
                absolute inset-0 w-full h-full z-5
                bg-gradient-to-br from-transparent via-primary/20 to-accent/30
                transition-all duration-500 ease-[cubic-bezier(.55,.24,.18,1)]
                ${isActive ? 'translate-y-full' : ''}
              `}></div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 p-4">
        <button 
          onClick={handlePrev}
          className="flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path d="M9.586 4l-6.586 6.586a2 2 0 0 0 0 2.828l6.586 6.586a2 2 0 0 0 2.18 .434l.145 -.068a2 2 0 0 0 1.089 -1.78v-2.586h7a2 2 0 0 0 2 -2v-4l-.005 -.15a2 2 0 0 0 -1.995 -1.85l-7 -.001v-2.585a2 2 0 0 0 -3.414 -1.414z"></path>
          </svg>
          <span className="sr-only md:not-sr-only">Previous</span>
        </button>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="sr-only md:not-sr-only">Next</span>
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path d="M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UniversitySlider;
//final