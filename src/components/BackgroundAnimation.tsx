import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';

interface Star {
  top: number;
  left: number;
  duration: number;
  delay: number;
}

interface ShootingStar {
  startY: number;
  endY: number;
  duration: number;
  delay: number;
}

export function BackgroundAnimation() {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      generatedStars.push({
        top: Math.floor(Math.random() * 100),
        left: Math.floor(Math.random() * 100),
        duration: (Math.floor(Math.random() * 20) + 20) / 10,
        delay: Math.floor(Math.random() * 20) / -10,
      });
    }
    setStars(generatedStars);

    const generatedShootingStars: ShootingStar[] = [];
    for (let i = 0; i < 10; i++) {
      const startY = Math.floor(Math.random() * 100) - 30;
      const endY = startY + (Math.floor(Math.random() * 30) + 40);
      generatedShootingStars.push({
        startY: startY,
        endY: endY,
        duration: Math.floor(Math.random() * 5) + 5,
        delay: Math.floor(Math.random() * 500) / 10,
      });
    }
    setShootingStars(generatedShootingStars);
  }, []);

  const backgroundAnimationStyles = `
    @keyframes flickr {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
    }

    @keyframes shooting-star {
      0% {
        left: -20vw;
        top: var(--start-y-vh);
        transform: rotate(20deg);
      }
      100% {
        left: 120vw;
        top: var(--end-y-vh);
        transform: rotate(20deg);
      }
    }

    .full-screen-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(to bottom, #4a7090, #7c6d8c, #d17b94);
      overflow: hidden;
      z-index: -20;
    }

    .star {
      position: absolute;
      width: 1px;
      height: 1px;
      border-radius: 1px;
      background: #fff;
    }

    .shooting-star {
      position: absolute;
      width: 120px;
      height: 3px;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8));
      transform-origin: 0% 50%;
      border-radius: 50%;
      filter: blur(1px);
    }
  `;

  return (
    <>
      <style>{backgroundAnimationStyles}</style>
      <div className="full-screen-background">
        {stars.map((s, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${s.top}vh`,
              left: `${s.left}vw`,
              animation: `flickr ${s.duration}s ${s.delay}s infinite`,
            }}
          ></div>
        ))}
        {shootingStars.map((ss, i) => (
          <div
            key={i}
            className="shooting-star"
            style={
              {
                '--start-y-vh': `${ss.startY}vh`,
                '--end-y-vh': `${ss.endY}vh`,
                animation: `shooting-star ${ss.duration}s ${ss.delay}s infinite backwards`,
              } as React.CSSProperties
            }
          ></div>
        ))}
      </div>
    </>
  );
}
