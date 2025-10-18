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
  const touchHandledRef = useRef(false);

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

  // Actualizar el theme-color del navegador y el background del body según el estado del juego
  useEffect(() => {
    const getThemeColor = () => {
      switch (gameState) {
        case 'waiting':
          return '#3b82f6'; // blue-500
        case 'ready':
          return '#ef4444'; // red-500
        case 'green':
          return '#22c55e'; // green-500
        case 'result':
          return '#3b82f6'; // blue-500
        case 'tooearly':
          return '#f97316'; // orange-500
        default:
          return '#3b82f6';
      }
    };

    const color = getThemeColor();

    // Actualizar meta tag theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', color);
    }

    // Actualizar color de fondo del body para iOS
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
  }, [gameState]);

  // Manejar la barra espaciadora
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        // Ignorar si es una repetición automática (tecla mantenida)
        if (e.repeat) {
          e.preventDefault();
          return;
        }
        e.preventDefault(); // Prevenir el scroll de la página
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, attempts, bestTime]);

  const startGame = () => {
    setGameState('ready');
    const randomDelay = Math.random() * 4000 + 1000; // Entre 1 y 5 segundos

    timeoutRef.current = setTimeout(() => {
      setGameState('green');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleInteraction = () => {
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

  const handleTouchStart = (e) => {
    e.preventDefault(); // Previene que se dispare onClick después del touch
    touchHandledRef.current = true;
    handleInteraction();

    // Resetear la bandera después de un breve tiempo
    setTimeout(() => {
      touchHandledRef.current = false;
    }, 500);
  };

  const handleMouseDown = (e) => {
    // Solo permitir click izquierdo (button === 0)
    if (e.button !== 0) {
      return;
    }
    // Si ya se manejó un evento touch recientemente, ignorar este evento
    if (touchHandledRef.current) {
      return;
    }
    handleInteraction();
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
          icon: <Zap className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 mx-auto" />,
          title: '¡Prueba tu velocidad!',
          subtitle: 'Haz clic para empezar'
        };
      case 'ready':
        return {
          icon: <Icon icon="mdi:timer-outline" className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 mx-auto animate-pulse" />,
          title: 'Espera...',
          subtitle: 'Prepárate para el verde'
        };
      case 'green':
        return {
          icon: <Icon icon="mdi:circle" className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 mx-auto text-green-400" />,
          title: '¡AHORA!',
          subtitle: '¡Haz clic rápido!'
        };
      case 'tooearly':
        return {
          icon: <Icon icon="mdi:close-circle" className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 mx-auto" />,
          title: '¡Demasiado pronto!',
          subtitle: 'Espera a que se ponga verde'
        };
      case 'result':
        return {
          icon: <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 mx-auto" />,
          title: `${reactionTime} ms`,
          subtitle: getPerformanceMessage(reactionTime)
        };
      default:
        return { icon: null, title: '', subtitle: '' };
    }
  };

  const getPerformanceMessage = (time) => {
    if (time < 200) return (
      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
        ¡Increíble! Reflejos de ninja <Icon icon="game-icons:ninja-head" className="w-5 h-5 sm:w-6 sm:h-6" />
      </span>
    );
    if (time < 250) return (
      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
        ¡Excelente! Muy rápido <Icon icon="mdi:lightning-bolt" className="w-5 h-5 sm:w-6 sm:h-6" />
      </span>
    );
    if (time < 300) return (
      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
        ¡Bien hecho! Buen tiempo <Icon icon="mdi:thumb-up" className="w-5 h-5 sm:w-6 sm:h-6" />
      </span>
    );
    if (time < 400) return (
      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
        No está mal, puedes mejorar <Icon icon="mdi:target" className="w-5 h-5 sm:w-6 sm:h-6" />
      </span>
    );
    return (
      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
        Un poco lento, inténtalo otra vez <Icon icon="mdi:snail" className="w-5 h-5 sm:w-6 sm:h-6" />
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
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="text-white text-center px-4">
        {message.icon}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{message.title}</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8">{message.subtitle}</p>

        {(gameState === 'result' || gameState === 'tooearly') && (
          <button className="bg-white text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            Intentar otra vez
          </button>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-black bg-opacity-30 rounded-lg p-2 sm:p-4 text-white">
          <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
            <Icon icon="mdi:chart-bar" className="w-4 h-4 sm:w-5 sm:h-5" />
            Estadísticas
          </div>
          <div className="text-[10px] sm:text-xs space-y-0.5 sm:space-y-1">
            <div>Intentos: {attempts.length}</div>
            <div>Mejor: {bestTime} ms</div>
            <div>Promedio: {getAverageTime()} ms</div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-black bg-opacity-30 rounded-lg p-2 sm:p-3 text-white text-[10px] sm:text-xs max-w-[160px] sm:max-w-xs">
        <div className="font-semibold mb-1 flex items-center gap-1 sm:gap-2">
          <Icon icon="mdi:clipboard-list-outline" className="w-3 h-3 sm:w-4 sm:h-4" />
          Cómo jugar:
        </div>
        <div className="space-y-0.5">
          <div>1. Haz clic para empezar</div>
          <div>2. Espera a que se ponga verde</div>
          <div>3. ¡Haz clic o pulsa espacio!</div>
        </div>
      </div>

      <a
        href="https://github.com/Anghios/reaction"
        target="_blank"
        rel="noopener noreferrer"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-black bg-opacity-30 hover:bg-opacity-40 rounded-lg p-2 sm:p-3 text-white text-[10px] sm:text-xs transition-all cursor-pointer touch-auto"
        style={{ touchAction: 'auto' }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Icon icon="mdi:github" className="w-4 h-4 sm:w-5 sm:h-5" />
          <div>
            <div className="font-semibold">Developed by Anghios</div>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
              <Icon icon="mdi:star" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{stars} stars</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
