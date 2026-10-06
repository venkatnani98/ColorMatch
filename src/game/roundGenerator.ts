import {getColorIds, type ColorCount, type ColorId} from './colors';
import type {Round} from './types';
import {shuffle} from '../utils/shuffle';

function chooseOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createRound(
  colorCount: ColorCount,
  previousRound?: Round,
): Round {
  const availableIds = getColorIds(colorCount);
  const inkColorId = chooseOne(availableIds);
  const wordColorId = chooseOne(availableIds.filter(id => id !== inkColorId));

  const round: Round = {
    wordColorId,
    inkColorId,
    choices: shuffle(availableIds),
  };

  // Same word + same ink twice in a row feels like a broken randomizer.
  if (
    previousRound &&
    previousRound.wordColorId === round.wordColorId &&
    previousRound.inkColorId === round.inkColorId
  ) {
    return createRound(colorCount, previousRound);
  }

  return round;
}

export function isCorrectAnswer(round: Round, selectedId: ColorId): boolean {
  return round.inkColorId === selectedId;
}

