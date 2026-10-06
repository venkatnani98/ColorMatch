import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@color-match/high-score';

export async function loadHighScore(): Promise<number> {
  const savedValue = await AsyncStorage.getItem(HIGH_SCORE_KEY);
  const parsed = Number(savedValue);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export async function saveHighScore(score: number): Promise<void> {
  await AsyncStorage.setItem(HIGH_SCORE_KEY, String(score));
}