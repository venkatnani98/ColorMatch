import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ColorButton} from '../components/ColorButton';
import {colorById, type ColorId} from '../game/colors';
import type {GameState} from '../game/gameReducer';

type Props = {
  state: GameState;
  onAnswer: (colorId: ColorId) => void;
};

function formatSeconds(milliseconds: number): string {
  return (milliseconds / 1000).toFixed(1);
}

function formatDelta(points: number | null): string {
  if (points === null) {
    return '';
  }
  return points > 0 ? `+${points}` : String(points);
}

export function GameScreen({state, onAnswer}: Props) {
  const word = colorById[state.round.wordColorId];
  const ink = colorById[state.round.inkColorId];
  const isLocked = state.status !== 'playing';
  const isLowTime = state.remainingMs <= 5_000;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.score}>Score {state.score}</Text>
          <Text style={styles.streak}>Streak {state.streak}</Text>
        </View>
        <View style={styles.timerGroup}>
          <Text style={[styles.timer, isLowTime && styles.lowTimer]}>
            {formatSeconds(state.remainingMs)}
          </Text>
          <Text style={styles.colorCount}>{state.activeColorCount} colors</Text>
        </View>
      </View>

      <View style={styles.promptArea}>
        <Text style={styles.instruction}>TAP THE INK COLOR</Text>
        <Text style={[styles.word, {color: ink.hex}]}>{word.label}</Text>
        <Text
          style={[
            styles.feedback,
            state.lastAnswerCorrect === true && styles.correct,
            state.lastAnswerCorrect === false && styles.wrong,
          ]}>
          {state.lastAnswerCorrect === null
            ? ''
            : `${state.lastAnswerCorrect ? 'Correct' : 'Wrong'} ${formatDelta(
                state.lastPointsDelta,
              )}`}
        </Text>
      </View>

      <View style={styles.grid}>
        {state.round.choices.map(colorId => (
          <ColorButton
            key={`${state.roundId}-${colorId}`}
            colorId={colorId}
            disabled={isLocked}
            isCorrectChoice={colorId === state.round.inkColorId}
            showFeedback={state.status === 'feedback'}
            onPress={onAnswer}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24},
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  score: {color: '#F8FAFC', fontSize: 20, fontWeight: '800'},
  streak: {color: '#94A3B8', fontSize: 14, fontWeight: '700', marginTop: 3},
  timerGroup: {alignItems: 'flex-end'},
  timer: {color: '#F8FAFC', fontSize: 22, fontVariant: ['tabular-nums'], fontWeight: '900'},
  lowTimer: {color: '#FB7185'},
  colorCount: {color: '#94A3B8', fontSize: 12, fontWeight: '700', marginTop: 3},
  promptArea: {alignItems: 'center', flex: 1, justifyContent: 'center'},
  instruction: {color: '#94A3B8', fontSize: 14, fontWeight: '800', letterSpacing: 1.2},
  word: {fontSize: 52, fontWeight: '900', marginTop: 12},
  feedback: {fontSize: 18, fontWeight: '800', height: 32, marginTop: 18},
  correct: {color: '#4ADE80'},
  wrong: {color: '#FB7185'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 18},
});

