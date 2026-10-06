import type {ColorCount, ColorId} from './colors';

export type Round = {
  wordColorId: ColorId;
  inkColorId: ColorId;
  choices: ColorId[];
};

export type GameModeId = 'fast' | 'classic' | 'extended';

export type GameSettings = {
  modeId: GameModeId;
  startColorCount: ColorCount;
};

