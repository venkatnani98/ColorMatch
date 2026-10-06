import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {GAME_MODES} from '../game/gameReducer';
import type {ColorCount} from '../game/colors';
import type {GameModeId, GameSettings} from '../game/types';

type Props = {
  bestScore: number;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onPlay: () => void;
};

function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
      accessibilityRole="button"
      accessibilityState={{selected}}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function HomeScreen({
  bestScore,
  settings,
  onSettingsChange,
  onPlay,
}: Props) {
  const selectMode = (modeId: GameModeId) => {
    onSettingsChange({...settings, modeId});
  };

  const selectColorCount = (startColorCount: ColorCount) => {
    onSettingsChange({...settings, startColorCount});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Match</Text>
      <Text style={styles.subtitle}>Tap the ink color — ignore the word.</Text>
      <Text style={styles.best}>Best score: {bestScore}</Text>

      <Text style={styles.sectionTitle}>MODE</Text>
      <View style={styles.options}>
        {(Object.keys(GAME_MODES) as GameModeId[]).map(modeId => (
          <OptionButton
            key={modeId}
            label={GAME_MODES[modeId].label}
            selected={settings.modeId === modeId}
            onPress={() => selectMode(modeId)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>STARTING COLORS</Text>
      <View style={styles.options}>
        <OptionButton
          label="4 colors"
          selected={settings.startColorCount === 4}
          onPress={() => selectColorCount(4)}
        />
        <OptionButton
          label="6 colors"
          selected={settings.startColorCount === 6}
          onPress={() => selectColorCount(6)}
        />
      </View>
      <Text style={styles.help}>4-color games upgrade to 6 colors at 100 points.</Text>

      <Pressable onPress={onPlay} style={styles.playButton} accessibilityRole="button">
        <Text style={styles.playText}>PLAY</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24},
  title: {color: '#F8FAFC', fontSize: 42, fontWeight: '900'},
  subtitle: {color: '#94A3B8', fontSize: 17, marginTop: 12, textAlign: 'center'},
  best: {color: '#FBBF24', fontSize: 18, fontWeight: '700', marginTop: 20},
  sectionTitle: {alignSelf: 'flex-start', color: '#94A3B8', fontSize: 12, fontWeight: '900', letterSpacing: 1.2, marginTop: 26},
  options: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, width: '100%'},
  option: {borderColor: '#475569', borderRadius: 12, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 11},
  optionSelected: {backgroundColor: '#7C3AED', borderColor: '#A78BFA'},
  optionText: {color: '#CBD5E1', fontSize: 14, fontWeight: '800'},
  optionTextSelected: {color: '#FFFFFF'},
  help: {alignSelf: 'flex-start', color: '#64748B', fontSize: 12, marginTop: 8},
  playButton: {backgroundColor: '#7C3AED', borderRadius: 18, marginTop: 30, padding: 20, width: '100%'},
  playText: {color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.6, textAlign: 'center'},
});

