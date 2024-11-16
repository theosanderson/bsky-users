import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Head from 'next/head';
import React from 'react';

// Butterfly Icon Component
function IconParkSolidButterfly(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
        <path fill="currentColor" d="M5 12c3.664-4.294 14.081 6.82 19 13c4.92-6.18 15.337-17.294 19-13c.679.65 1.443 2.877-1 6c-.678.976-1.814 3.706-1 8c0 1.139-1.115 2.952-6 1c2.375 1.627 6.85 6.096 4 10c-2.714 3.416-9.035 7.457-13-2l-2-4l-2 4c-3.964 9.457-10.286 5.416-13 2c-2.85-3.904 1.626-8.373 4-10c-4.885 1.952-6 .139-6-1c.814-4.294-.321-7.024-1-8c-2.442-3.123-1.678-5.35-1-6"/>
        <path d="M24.032 23C23.534 17.864 28.913 7 33 7"/>
        <path d="M23.968 23C24.466 17.864 19.087 7 15 7"/>
      </g>
    </svg>
  );
}


const ConfettiAnimation = () => {
  const canvasRef = useRef(null);
  const confettiRef = useRef([]);
  const requestRef = useRef();

  const COLORS = [
    [235, 90, 70],
    [97, 189, 79],
    [242, 214, 0],
    [0, 121, 191],
    [195, 119, 224]
  ];

  const NUM_CONFETTI = 40;
  const PI_2 = 2 * Math.PI;

  const range = (a, b) => (b - a) * Math.random() + a;

  class Confetti {
    constructor(canvas) {
      this.canvas = canvas;
      this.style = COLORS[~~range(0, 5)];
      this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
      this.r = ~~range(2, 6);
      this.r2 = 2 * this.r;
      this.replace();
    }

    replace() {
      this.opacity = 0;
      this.dop = 0.03 * range(1, 4);
      this.x = range(-this.r2, this.canvas.width - this.r2);
      this.y = range(-20, this.canvas.height - this.r2);
      this.xmax = this.canvas.width - this.r;
      this.ymax = this.canvas.height - this.r;
      this.vx = range(0, 2) + 8 * 0.5 - 5; // Using 0.5 as default xpos
      this.vy = 0.7 * this.r + range(-1, 1);
    }

    draw(context) {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity += this.dop;

      if (this.opacity > 1) {
        this.opacity = 1;
        this.dop *= -1;
      }

      if (this.opacity < 0 || this.y > this.ymax) {
        this.replace();
      }

      if (!(this.x > 0 && this.x < this.xmax)) {
        this.x = (this.x + this.xmax) % this.xmax;
      }

      // Draw shapes
      const drawCircle = (x, y, r, style) => {
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(x - 17, y + 14, x + 13, y + 5, x - 5, y + 22);
        context.lineWidth = 2;
        context.strokeStyle = style;
        context.stroke();
      };

      const drawCircle2 = (x, y, r, style) => {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 6, y + 9);
        context.lineTo(x + 12, y);
        context.lineTo(x + 6, y - 9);
        context.closePath();
        context.fillStyle = style;
        context.fill();
      };

      const drawCircle3 = (x, y, r, style) => {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + 5, y + 5);
        context.lineTo(x + 10, y);
        context.lineTo(x + 5, y - 5);
        context.closePath();
        context.fillStyle = style;
        context.fill();
      };

      const color = `${this.rgb},${this.opacity})`;
      drawCircle(~~this.x, ~~this.y, this.r, color);
      drawCircle3(0.5 * ~~this.x, ~~this.y, this.r, color);
      drawCircle2(1.5 * ~~this.x, 1.5 * ~~this.y, this.r, color);
    }
  }

  const step = (timestamp) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    confettiRef.current.forEach(confetti => confetti.draw(context));
    requestRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize confetti
    confettiRef.current = Array.from({ length: NUM_CONFETTI }, () => new Confetti(canvas));

    // Start animation
    requestRef.current = requestAnimationFrame(step);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full fixed top-0 left-0 pointer-events-none">
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-5 pointer-events-none"
      />
    </div>
  );
};

// Confetti Component
const Confetti = ({ count }) => {
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(Math.floor((count-1) / 1000000) * 1000000);


  useEffect(() => {
    const currentMilestone = Math.floor((count-1) / 1000000) * 1000000;
    
    if ((count > lastMilestone && currentMilestone > lastMilestone) || window.hello) {
      setLastMilestone(currentMilestone);
      setIsAnimating(true);
     
      setTimeout(() => setIsAnimating(false), 30000);
    }
  }, [count, lastMilestone]);

  return isAnimating ? <ConfettiAnimation /> : null;
};

export default function Home({ initialData }) {
  const [oldStats, setOldStats] = useState(initialData);
  const [newStats, setNewStats] = useState(initialData);
  const [currentCount, setCurrentCount] = useState(initialData.last_user_count);
  const [timeOffset, setTimeOffset] = useState(0);
  const [transitionStartTime, setTransitionStartTime] = useState(null);
  const transitionDuration = 50000;
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    const offset = Date.now() / 1000 - initialData.timestamp;
    setTimeOffset(offset);
  }, [initialData.timestamp]);

  useEffect(() => {
    const checkFreshness = () => {
      const currentTime = Date.now() / 1000;
      const timeSinceLastUpdate = currentTime - (newStats.last_timestamp + timeOffset);
      setIsStale(timeSinceLastUpdate > 600); // 5 minutes = 300 seconds
    };

    // Check immediately
    checkFreshness();

    // Check periodically
    const interval = setInterval(checkFreshness, 1000);
    return () => clearInterval(interval);
  }, [newStats.last_timestamp, timeOffset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/stats');
        const timeDifference = response.data.last_timestamp - newStats.last_timestamp;
        if (timeDifference > 600) {
          setOldStats(response.data);
          setNewStats(response.data);
          setTransitionStartTime(null);
        } else {
          setOldStats(newStats);
          setNewStats(response.data);
          setTransitionStartTime(Date.now());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsStale(true);
      }
    };

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [newStats]);

  const easeSmoothLinear = (x) => {
    const cubicWeight = 0.1;
    const linearWeight = 0.9;
    
    const cubic = x < 0.5 
      ? 4 * x * x * x 
      : 1 - Math.pow(-2 * x + 2, 3) / 2;
    
    const linear = x;
    
    return (cubic * cubicWeight) + (linear * linearWeight);
  };

  useEffect(() => {
    const animateCount = () => {
      const now = Date.now();
      const timeSinceTransitionStart = transitionStartTime ? now - transitionStartTime : 0;
      const transitionProgress = Math.min(timeSinceTransitionStart / transitionDuration, 1);
      
      const oldTimeDiff = (now / 1000) + timeOffset - oldStats.last_timestamp;
      const oldPrediction = oldStats.last_user_count + (oldStats.growth_per_second * oldTimeDiff);
      
      const newTimeDiff = (now / 1000) + timeOffset - newStats.last_timestamp;
      const newPrediction = newStats.last_user_count + (newStats.growth_per_second * newTimeDiff);
      
      const interpolatedCount = oldPrediction + (newPrediction - oldPrediction) * easeSmoothLinear(transitionProgress);
      
      setCurrentCount(Math.floor(interpolatedCount));
    };

    const animation = setInterval(animateCount, 10);
    return () => clearInterval(animation);
  }, [oldStats, newStats, timeOffset, transitionStartTime]);

  return (
    <div className="min-h-screen w-full bg-sky-50 flex flex-col items-center justify-center">
      <Head>
        <title>Bluesky User Counter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Confetti count={currentCount} />

      <main className="text-center">
        <h1 className="text-3xl xs:text-4xl font-bold text-sky-600 mb-8">
          <IconParkSolidButterfly className="inline-block w-8 xs:w-10 h-8 xs:h-10 mr-2 pb-1.5" /> 
          Bluesky User Count
        </h1>
        
        {isStale ? (
          <div className="bg-white sm:rounded-lg shadow-lg p-8 xs:p-8 mb-8">
            <p className="text-lg xs:text-xl text-gray-600">
              Data temporarily unavailable
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please check back in a few minutes<br />
              Last known count: {currentCount.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="bg-white sm:rounded-lg shadow-lg p-8 xs:p-8 mb-8">
            <h2 className="text-6xl xs:text-7xl font-bold text-sky-500 mb-4 tabular-nums" style={{fontKerning: "none"}}>
              {currentCount.toLocaleString()}
            </h2>
            <p className="text-lg xs:text-xl text-sky-700">Total Bluesky Users</p>
            <p className="text-xs text-sky-700 mt-1.5 -mb-2 opacity-70 hidden">+{Math.round(newStats.growth_per_second).toLocaleString()} per sec</p> 
          </div>
        )}
        
        <p className="text-base leading-snug xs:leading-snug md:leading-normal xs:text-lg text-sky-700 max-w-2xl px-3 mt-10">
          Powered by{' '}
          <a href="https://bsky.jazco.dev/stats" className="text-sky-600 hover:underline" target="_blank" rel="noreferrer">
            Jaz's bsky stats
          </a>
          {' '}with some extra interpolation.  Made by{' '}
          <a href="https://bsky.app/profile/theo.io" className="text-sky-600 hover:underline" target="_blank" rel="noreferrer">
            @theo.io
          </a>
          . Increasing by {newStats.growth_per_second.toFixed(1)}&nbsp;users per second.
        </p>
      </main>

      <footer className="mt-6 xs:mt-8 px-2 xs:px-4 text-center text-sky-700">
        <p className="text-sm xs:text-base leading-snug xs:leading-snug md:leading-normal">
          Try the{' '}
          <a href="https://bsky-follow-finder.theo.io/" className="text-sky-600 hover:underline" target="_blank" rel="noreferrer">
            Bluesky Network Analyser
          </a>
          {' '}to find people followed by those you follow.
        </p>
      </footer>
    </div>
  );
}


export async function getServerSideProps(context) {
  try {
    const url = `https://bsky-users.vercel.app/api/stats`;
    const response = await axios.get(url);
    return {
      props: {
        initialData: {...response.data, timestamp: Math.floor(Date.now() / 1000)},
      },
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      props: {
        initialData: {
          last_timestamp: Math.floor(Date.now() / 1000),
          last_user_count: 0,
          growth_per_second: 0,
          timestamp: Math.floor(Date.now() / 1000),
        },
      },
    };
  }
}
