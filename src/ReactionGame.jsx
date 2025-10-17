import React, { useState, useEffect, useRef } from 'react';
import { Zap, Trophy, RotateCcw } from 'lucide-react';
import { Icon } from '@iconify/react';

export default function ReactionGame() {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, green, result, tooearly
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [stars, setStars] = useState(0);
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const savedAttempts = localStorage.getItem('reactionAttempts');
    const savedBestTime = localStorage.getItem('reactionBestTime');

    if (savedAttempts) {
      const parsedAttempts = JSON.parse(savedAttempts);
      setAttempts(parsedAttempts);
    }

    if (savedBestTime) {
      setBestTime(parseInt(savedBestTime));
    }
  }, []);

  // Obtener estrellas de GitHub
  useEffect(() => {
    fetch('https://api.github.com/repos/Anghios/reaction')
      .then(response => response.json())
      .then(data => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        }
      })
      .catch(error => console.error('Error fetching GitHub stars:', error));
  }, []);

  // Guardar datos en localStorage cuando cambien los intentos
  useEffect(() => {
    if (attempts.length > 0) {
      localStorage.setItem('reactionAttempts', JSON.stringify(attempts));
      localStorage.setItem('reactionBestTime', bestTime.toString());
    }
  }, [attempts, bestTime]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameState('ready');
    const randomDelay = Math.random() * 4000 + 1000; // Entre 1 y 5 segundos

    timeoutRef.current = setTimeout(() => {
      setGameState('green');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'ready') {
      // Hizo clic demasiado pronto
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState('tooearly');
    } else if (gameState === 'green') {
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);

      const newAttempts = [...attempts, reaction];
      setAttempts(newAttempts);

      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction);
      }

      setGameState('result');
    } else if (gameState === 'result' || gameState === 'tooearly') {
      reset();
    }
  };

  const reset = () => {
    setGameState('waiting');
    setReactionTime(null);
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-blue-500';
      case 'ready':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      case 'result':
        return 'bg-blue-500';
      case 'tooearly':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting':
        return {
          icon: <Zap className="w-16 h-16 mb-4 mx-auto" />,
          title: '¡Prueba tu velocidad!',
          subtitle: 'Haz clic para empezar'
        };
      case 'ready':
        return {
          icon: <Icon icon="mdi:timer-outline" className="w-16 h-16 mb-4 mx-auto animate-pulse" />,
          title: 'Espera...',
          subtitle: 'Prepárate para el verde'
        };
      case 'green':
        return {
          icon: <Icon icon="mdi:circle" className="w-16 h-16 mb-4 mx-auto text-green-400" />,
          title: '¡AHORA!',
          subtitle: '¡Haz clic rápido!'
        };
      case 'tooearly':
        return {
          icon: <Icon icon="mdi:close-circle" className="w-16 h-16 mb-4 mx-auto" />,
          title: '¡Demasiado pronto!',
          subtitle: 'Espera a que se ponga verde'
        };
      case 'result':
        return {
          icon: <Trophy className="w-16 h-16 mb-4 mx-auto" />,
          title: `${reactionTime} ms`,
          subtitle: getPerformanceMessage(reactionTime)
        };
      default:
        return { icon: null, title: '', subtitle: '' };
    }
  };

  const getPerformanceMessage = (time) => {
    if (time < 200) return (
      <span className="flex items-center justify-center gap-2">
        ¡Increíble! Reflejos de ninja <Icon icon="game-icons:ninja-head" className="w-6 h-6" />
      </span>
    );
    if (time < 250) return (
      <span className="flex items-center justify-center gap-2">
        ¡Excelente! Muy rápido <Icon icon="mdi:lightning-bolt" className="w-6 h-6" />
      </span>
    );
    if (time < 300) return (
      <span className="flex items-center justify-center gap-2">
        ¡Bien hecho! Buen tiempo <Icon icon="mdi:thumb-up" className="w-6 h-6" />
      </span>
    );
    if (time < 400) return (
      <span className="flex items-center justify-center gap-2">
        No está mal, puedes mejorar <Icon icon="mdi:target" className="w-6 h-6" />
      </span>
    );
    return (
      <span className="flex items-center justify-center gap-2">
        Un poco lento, inténtalo otra vez <Icon icon="mdi:snail" className="w-6 h-6" />
      </span>
    );
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return null;
    const sum = attempts.reduce((a, b) => a + b, 0);
    return Math.round(sum / attempts.length);
  };

  const message = getMessage();

  return (
    <div
      className={`min-h-screen ${getBackgroundColor()} transition-colors duration-200 flex flex-col items-center justify-center p-4 cursor-pointer select-none`}
      onClick={handleClick}
    >
      <div className="text-white text-center">
        {message.icon}
        <h1 className="text-5xl font-bold mb-2">{message.title}</h1>
        <p className="text-2xl mb-8">{message.subtitle}</p>

        {(gameState === 'result' || gameState === 'tooearly') && (
          <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
            <RotateCcw className="w-5 h-5" />
            Intentar otra vez
          </button>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="absolute bottom-8 left-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Icon icon="mdi:chart-bar" className="w-5 h-5" />
            Estadísticas
          </div>
          <div className="text-xs space-y-1">
            <div>Intentos: {attempts.length}</div>
            <div>Mejor: {bestTime} ms</div>
            <div>Promedio: {getAverageTime()} ms</div>
          </div>
        </div>
      )}

      <div className="absolute top-8 right-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-white text-xs max-w-xs">
        <div className="font-semibold mb-1 flex items-center gap-2">
          <Icon icon="mdi:clipboard-list-outline" className="w-4 h-4" />
          Cómo jugar:
        </div>
        <div>1. Haz clic para empezar</div>
        <div>2. Espera a que se ponga verde</div>
        <div>3. ¡Haz clic lo más rápido posible!</div>
      </div>

      <a
        href="https://github.com/Anghios/reaction"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 right-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-white text-xs hover:bg-opacity-30 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:github" className="w-5 h-5" />
          <div>
            <div className="font-semibold">Developed by Anghios</div>
            <div className="flex items-center gap-1 mt-1">
              <Icon icon="mdi:star" className="w-3 h-3" />
              <span>{stars} stars</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
