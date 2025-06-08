import { useState, useEffect, useCallback } from 'react';

// Custom hook for quiz timer functionality
export const useTimer = (initialTime = 1800, onTimeUp = null) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Start timer
  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // Reset timer
  const resetTimer = useCallback((newTime = initialTime) => {
    setTimeLeft(newTime);
    setIsRunning(false);
    setIsPaused(false);
  }, [initialTime]);

  // Format time to MM:SS
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get time status
  const getTimeStatus = useCallback(() => {
    if (timeLeft <= 0) return 'expired';
    if (timeLeft <= 300) return 'warning'; // 5 minutes
    if (timeLeft <= 600) return 'caution'; // 10 minutes
    return 'normal';
  }, [timeLeft]);

  // Timer effect
  useEffect(() => {
    let interval = null;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setIsRunning(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft, onTimeUp]);

  return {
    timeLeft,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formatTime: formatTime(timeLeft),
    getTimeStatus: getTimeStatus(),
    formattedTime: formatTime(timeLeft)
  };
};
