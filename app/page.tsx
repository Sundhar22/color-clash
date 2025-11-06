"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [rounds, setRounds] = useState(10);
  const [wordsPerRow, setWordsPerRow] = useState(4);
  const [countdown, setCountdown] = useState(5);
  const [showWarning, setShowWarning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [preRoundCountdown, setPreRoundCountdown] = useState(0);
  const [showingWords, setShowingWords] = useState(false);
  const [roundCountdown, setRoundCountdown] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeUp, setTimeUp] = useState(false);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown','black','grey','white'];
  const colorWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN','BLACK','GREY','WHITE'];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
  const getRandomWord = () => colorWords[Math.floor(Math.random() * colorWords.length)];

  const [words, setWords] = useState([]);

const generateWords = () => {
  // Step 1: Select random unique colors
  const selectedColors = [...colors]
    .sort(() => Math.random() - 0.5)
    .slice(0, wordsPerRow);
  
  // Step 2: Create all possible valid combinations
// @ts-ignore
let combinations = [];
  
  // Generate all permutations where color name ≠ display color
  selectedColors.forEach(color => {
    selectedColors.forEach(nameColor => {
      if (color !== nameColor) {
        combinations.push({
          word: nameColor.toUpperCase(),
          color: color
        });
      }
    });
  });
  
  // Shuffle combinations
  combinations = combinations.sort(() => Math.random() - 0.5);
  
  // Step 3: Select unique combinations
  const newWords = [];
  const usedColors = new Set();
  const usedWords = new Set();
  
  for (const combo of combinations) {
    if (!usedColors.has(combo.color) && !usedWords.has(combo.word)) {
      usedColors.add(combo.color);
      usedWords.add(combo.word);
      newWords.push({
        ...combo,
        id: newWords.length
      });
      
      if (newWords.length >= wordsPerRow) break;
    }
  }
  
  // If we couldn't find enough unique combinations, fill remaining
  while (newWords.length < wordsPerRow) {
    const availableCombos = combinations.filter(combo => 
      !usedColors.has(combo.color) && !usedWords.has(combo.word)
    );
    
    if (availableCombos.length === 0) break;
    
    const combo = availableCombos[0];
    usedColors.add(combo.color);
    usedWords.add(combo.word);
    newWords.push({
      ...combo,
      id: newWords.length
    });
  }
  
  setWords(newWords);
};

  const handleStart = () => {
    if (rounds > 20) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    setGameStarted(true);
    setCurrentRound(1);
    setBlueScore(0);
    setRedScore(0);
    setUserAnswers([]);
    startNewRound();
  };

  const startNewRound = () => {
    generateWords();
    setPreRoundCountdown(5);
    setShowingWords(false);
    setTimeUp(false);
  };

  useEffect(() => {
    if (preRoundCountdown > 0) {
      const timer = setTimeout(() => {
        setPreRoundCountdown(preRoundCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (preRoundCountdown === 0 && gameStarted && !showingWords && words.length > 0) {
      setShowingWords(true);
      setRoundCountdown(countdown);
    }
  }, [preRoundCountdown, gameStarted, showingWords, words, countdown]);

  useEffect(() => {
    if (showingWords && roundCountdown > 0) {
      const timer = setTimeout(() => {
        setRoundCountdown(roundCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showingWords && roundCountdown === 0 && !timeUp) {
      setTimeUp(true);
    }
  }, [showingWords, roundCountdown, timeUp]);

  const handleAnswer = (team) => {
    if (team === 'blue') {
      setBlueScore(blueScore + 1);
    } else if (team === 'red') {
      setRedScore(redScore + 1);
    }
    
    setUserAnswers([...userAnswers, team]);
    
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
      startNewRound();
    } else {
      endGame();
    }
  };

  const handleContinue = () => {
    if (currentRound < rounds) {
      setCurrentRound(currentRound + 1);
      startNewRound();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setTimeout(() => {
      alert(`Game Over!\nBlue Team: ${blueScore}\nRed Team: ${redScore}`);
      setGameStarted(false);
    }, 500);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setCurrentRound(1);
    setBlueScore(0);
    setRedScore(0);
    setUserAnswers([]);
  };

  if (gameStarted) {
    if (preRoundCountdown > 0) {
      return (
        <main className="flex min-h-screen w-full font-sans flex-col items-center justify-center py-16 px-8 bg-black">
          <motion.div
            key={preRoundCountdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-9xl font-extrabold text-cyan-400"
          >
            {preRoundCountdown}
          </motion.div>
          <p className="text-gray-300 text-xl mt-8">Get Ready!</p>
        </main>
      );
    }

    if (showingWords) {
      return (
        <main className="flex min-h-screen w-full font-sans flex-col items-center justify-center py-16 px-8 bg-black">
          <div className="mb-8 flex justify-between w-full max-w-2xl">
            <div className="text-cyan-400 text-xl font-semibold">
              Round: {currentRound}/{rounds}
            </div>
            <div className="text-blue-400 text-xl font-semibold">
              Blue: {blueScore}
            </div>
            <div className="text-red-400 text-xl font-semibold">
              Red: {redScore}
            </div>
            <div className="text-yellow-400 text-xl font-semibold">
              Time: {roundCountdown}s
            </div>
          </div>

          <div className="mb-12 text-center">
            <p className="text-gray-300 text-lg mb-8">
              Say the <strong className="text-cyan-400">COLOR</strong> of each word out loud:
            </p>
            <div className="flex flex-wrap gap-8 justify-center max-w-4xl">
              {words.map((item) => (
                <div
                  key={item.id}
                  className="text-6xl font-extrabold uppercase tracking-wider p-6 bg-neutral-900 rounded-xl border-2 border-neutral-700"
                  style={{ color: item.color }}
                >
                  {item.word}
                </div>
              ))}
            </div>
          </div>

          {timeUp && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-4 text-red-300 text-xl font-bold text-center"
            >
              ⏰ Time's Up!
            </motion.div>
          )}

          <div className="mt-12 flex gap-4">
            <motion.button
              whileHover={ { scale: 1.05 }}
              whileTap={ { scale: 0.95 } }
              onClick={() =>  handleAnswer('blue')}
              className={`px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg ${ 'hover:bg-blue-500'}`}
            >
              Blue Team
            </motion.button>
            <motion.button
              whileHover={ { scale: 1.05 } }
              whileTap={ { scale: 0.95 } }
              onClick={() =>  handleAnswer('red')}
              className={`px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg ${ 'hover:bg-red-500'}`}
            >
              Red Team
            </motion.button>
          </div>

          {timeUp && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold text-lg"
            >
              Continue to Next Round →
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToMenu}
            className="mt-12 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg font-semibold"
          >
            ← Back to Menu
          </motion.button>
        </main>
      );
    }
  }

  return (
    <main className="flex min-h-screen w-full font-sans flex-col items-center justify-between py-32 px-16 bg-zinc-50 dark:bg-black">
      <motion.h1
        className="flex flex-col items-center justify-center text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <span className="text-3xl md:text-4xl text-gray-300 font-medium leading-none">
          Welcome to
        </span>
        <span
          className="mt-2 text-5xl md:text-6xl font-extrabold 
             bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 
             bg-clip-text text-transparent 
             drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]
             animate-gradient-x uppercase tracking-wider leading-none"
        >
          Color Clash 🎨
        </span>
      </motion.h1>

      <p className="text-lg text-gray-200 mb-8 text-center max-w-md">
        Say the <strong>color</strong> of the word, not the word itself!
        Configure your game settings below 👇
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-lg shadow-cyan-900/40 space-y-6">
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm text-center"
          >
            ⚠️ Too many rounds! Please keep it under 20 for optimal performance.
          </motion.div>
        )}

        <div>
          <label className="block text-sm mb-2 text-gray-300 font-medium">
            Number of Rounds
          </label>
          <input
            type="number"
            min="1"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value))}
            className="w-full p-2 rounded-md text-white outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300 font-medium">
            Words per Row
          </label>
          <input
            type="number"
            min="2"
            max="5"
            value={wordsPerRow}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setWordsPerRow(value > 5 ? 5 : value < 2 ? 2 : value);
            }}
            className="w-full p-2 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-300 font-medium">
            Countdown Seconds
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={countdown}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setCountdown(value > 10 ? 10 : value < 1 ? 1 : value);
            }}
            className="w-full p-2 rounded-md text-white outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="w-full py-3 mt-4 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 rounded-lg font-semibold text-lg shadow-md shadow-cyan-500/30"
        >
          Start Game 🚀
        </motion.button>
      </div>
    </main>
  );
}
