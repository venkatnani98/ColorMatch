import React, {useEffect, useReducer, useRef, useState} from 'react';
import {AppState, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {
  createInitialState,
  feedbackDelayMs,
  gameReducer,
} from './src/game/gameReducer';
import {HomeScreen} from './src/screens/HomeScreen';
import {GameScreen} from './src/screens/GameScreen';
import {ResultScreen} from './src/screens/ResultScreen';
import {loadHighScore, saveHighScore} from './src/storage/highScore';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [bestScore, setBestScore] = useState(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    void loadHighScore().then(setBestScore).catch(() => setBestScore(0));
  }, []);

  // This interval only redraws the countdown. The reducer uses exact timestamps.
  useEffect(() => {
    if (state.status !== 'playing' && state.status !== 'feedback') {
      return;
    }

    const intervalId = setInterval(() => {
      dispatch({type: 'TICK', now: Date.now()});
    }, 100);

    return () => clearInterval(intervalId);
  }, [state.status]);

  // Lock the answers briefly, then create the next round. It becomes 180ms after 200 points.
  useEffect(() => {
    if (state.status !== 'feedback') {
      return;
    }

    const timeoutId = setTimeout(
      () => dispatch({type: 'NEXT_ROUND'}),
      feedbackDelayMs(state),
    );
    return () => clearTimeout(timeoutId);
  }, [state.status, state.roundId, state.quickFeedbackUnlocked]);

  // A backgrounded game keeps the remaining time instead of losing it.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const wasActive = appState.current === 'active';
      const isActive = nextAppState === 'active';

      if (wasActive && !isActive) {
        dispatch({type: 'PAUSE', now: Date.now()});
      }
      if (!wasActive && isActive) {
        dispatch({type: 'RESUME', now: Date.now()});
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (state.status !== 'finished') {
      return;
    }

    setBestScore(currentBest => {
      const nextBest = Math.max(currentBest, state.score);
      if (nextBest > currentBest) {
        void saveHighScore(nextBest);
      }
      return nextBest;
    });
  }, [state.status, state.score]);

  const startGame = () => dispatch({type: 'START_GAME', now: Date.now()});

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#101217" />
      {state.status === 'home' && (
        <HomeScreen
          bestScore={bestScore}
          settings={state.settings}
          onSettingsChange={settings => dispatch({type: 'SET_SETTINGS', settings})}
          onPlay={startGame}
        />
      )}
      {(state.status === 'playing' || state.status === 'feedback') && (
        <GameScreen
          state={state}
          onAnswer={colorId =>
            dispatch({type: 'ANSWER_SELECTED', colorId, now: Date.now()})
          }
        />
      )}
      {state.status === 'finished' && (
        <ResultScreen
          score={state.score}
          bestScore={bestScore}
          bestStreak={state.bestStreak}
          onPlayAgain={startGame}
          onHome={() => dispatch({type: 'GO_HOME'})}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: '#101217', flex: 1},
});

