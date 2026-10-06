import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colorById, type ColorId} from '../game/colors';

type Props = {
  colorId: ColorId;
  disabled: boolean;
  isCorrectChoice: boolean;
  showFeedback: boolean;
  onPress: (colorId: ColorId) => void;
};

export function ColorButton({
  colorId,
  disabled,
  isCorrectChoice,
  showFeedback,
  onPress,
}: Props) {
  const color = colorById[colorId];

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPress(colorId)}
      style={({pressed}) => [
        styles.button,
        {backgroundColor: color.hex},
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        showFeedback && isCorrectChoice && styles.correctChoice,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Choose ${color.label}`}>
      <Text style={[styles.text, {color: color.textHex}]}>{color.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 16,
    borderWidth: 4,
    flexGrow: 1,
    flexBasis: '46%',
    justifyContent: 'center',
    minHeight: 76,
  },
  text: {fontSize: 18, fontWeight: '800'},
  pressed: {opacity: 0.72, transform: [{scale: 0.97}]},
  disabled: {opacity: 0.62},
  correctChoice: {borderColor: '#FFFFFF'},
});

