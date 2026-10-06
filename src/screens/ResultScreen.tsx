import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

type Props = {
  score: number;
  bestScore: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onHome: () => void;
};

export function ResultScreen({
  score,
  bestScore,
  bestStreak,
  onPlayAgain,
  onHome,
}: Props) {
  const isNewBest = score > 0 && score === bestScore;

  return (
    <View style={styles.container}>
      <Text style={styles.over}>TIME UP</Text>
      <Text style={[styles.score, score < 0 && styles.negativeScore]}>{score}</Text>
      <Text style={styles.label}>YOUR SCORE</Text>
      {isNewBest && <Text style={styles.newBest}>NEW BEST!</Text>}
      <Text style={styles.stat}>Best score: {bestScore}</Text>
      <Text style={styles.stat}>Best streak: {bestStreak}</Text>

      <Pressable onPress={onPlayAgain} style={styles.primary} accessibilityRole="button">
        <Text style={styles.primaryText}>PLAY AGAIN</Text>
      </Pressable>
      <Pressable onPress={onHome} style={styles.secondary} accessibilityRole="button">
        <Text style={styles.secondaryText}>HOME</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24},
  over: {color: '#94A3B8', fontSize: 16, fontWeight: '900', letterSpacing: 2},
  score: {color: '#F8FAFC', fontSize: 82, fontWeight: '900', marginTop: 12},
  negativeScore: {color: '#FB7185'},
  label: {color: '#CBD5E1', fontSize: 14, fontWeight: '800', letterSpacing: 1},
  newBest: {color: '#FBBF24', fontSize: 18, fontWeight: '900', marginTop: 16},
  stat: {color: '#CBD5E1', fontSize: 17, marginTop: 10},
  primary: {backgroundColor: '#7C3AED', borderRadius: 18, marginTop: 34, padding: 20, width: '100%'},
  primaryText: {color: 'white', fontSize: 16, fontWeight: '900', textAlign: 'center'},
  secondary: {marginTop: 8, padding: 18},
  secondaryText: {color: '#CBD5E1', fontSize: 15, fontWeight: '800'},
});

