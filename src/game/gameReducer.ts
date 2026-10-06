import type {ColorCount, ColorId} from './colors';
import {createRound, isCorrectAnswer} from './roundGenerator';
import type {GameModeId, GameSettings, Round} from './types';

export type GameStatus = 'home' | 'playing' | 'feedback' | 'finished';

export const GAME_MODES: Record<
  GameModeId,
  {label: string; durationMs: number}
> = {
  fast: {label: 'Fast · 20s', durationMs: 20_000},
  classic: {label: 'Classic · 30s', durationMs: 30_000},
  extended: {label: 'Extended · 45s', durationMs: 45_000},
};

export const DEFAULT_SETTINGS: GameSettings = {
  modeId: 'classic',
  startColorCount: 4,
};

export const SCORE_FOR_CORRECT = 10;
export const PENALTY_FOR_WRONG = -5;
export const STREAK_BONUS = 5;
export const SIX_COLORS_AT_SCORE = 100;
export const QUICK_FEEDBACK_AT_SCORE = 200;
export const DEFAULT_FEEDBACK_MS = 280;
export const QUICK_FEEDBACK_MS = 180;

export type GameState = {
  status: GameStatus;
  settings: GameSettings;
  score: number;
  streak: number;
  bestStreak: number;
  round: Round;
  roundId: number;
  activeColorCount: ColorCount;
  endTimeMs: number | null;
  remainingMs: number;
  lastAnswerCorrect: boolean | null;
  lastPointsDelta: number | null;
  sixColorsUnlocked: boolean;
  quickFeedbackUnlocked: boolean;
};

export type GameAction =
  | {type: 'SET_SETTINGS'; settings: GameSettings}
  | {type: 'START_GAME'; now: number}
  | {type: 'ANSWER_SELECTED'; colorId: ColorId; now: number}
  | {type: 'NEXT_ROUND'}
  | {type: 'TICK'; now: number}
  | {type: 'PAUSE'; now: number}
  | {type: 'RESUME'; now: number}
  | {type: 'GO_HOME'};

export function createInitialState(
  settings: GameSettings = DEFAULT_SETTINGS,
): GameState {
  const durationMs = GAME_MODES[settings.modeId].durationMs;

  return {
    status: 'home',
    settings,
    score: 0,
    streak: 0,
    bestStreak: 0,
    round: createRound(settings.startColorCount),
    roundId: 0,
    activeColorCount: settings.startColorCount,
    endTimeMs: null,
    remainingMs: durationMs,
    lastAnswerCorrect: null,
    lastPointsDelta: null,
    sixColorsUnlocked: settings.startColorCount === 6,
    quickFeedbackUnlocked: false,
  };
}

export function feedbackDelayMs(state: GameState): number {
  return state.quickFeedbackUnlocked ? QUICK_FEEDBACK_MS : DEFAULT_FEEDBACK_MS;
}

function finishIfExpired(state: GameState, now: number): GameState | null {
  if (state.endTimeMs === null) {
    return null;
  }

  const remainingMs = Math.max(0, state.endTimeMs - now);
  if (remainingMs === 0) {
    return {...state, status: 'finished', remainingMs: 0};
  }

  return {...state, remainingMs};
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SETTINGS':
      if (state.status !== 'home') {
        return state;
      }
      return createInitialState(action.settings);

    case 'START_GAME': {
      const freshState = createInitialState(state.settings);
      const durationMs = GAME_MODES[state.settings.modeId].durationMs;
      return {
        ...freshState,
        status: 'playing',
        endTimeMs: action.now + durationMs,
      };
    }

    case 'TICK':
      if (state.status !== 'playing' && state.status !== 'feedback') {
        return state;
      }
      return finishIfExpired(state, action.now) ?? state;

    case 'ANSWER_SELECTED': {
      if (state.status !== 'playing') {
        return state;
      }

      const timingState = finishIfExpired(state, action.now);
      if (timingState?.status === 'finished') {
        return timingState;
      }

      const correct = isCorrectAnswer(state.round, action.colorId);
      const nextStreak = correct ? state.streak + 1 : 0;
      const streakBonus = correct && nextStreak % 5 === 0 ? STREAK_BONUS : 0;
      const pointsDelta = correct
        ? SCORE_FOR_CORRECT + streakBonus
        : PENALTY_FOR_WRONG;
      const nextScore = state.score + pointsDelta;
      const sixColorsUnlocked =
        state.sixColorsUnlocked || nextScore >= SIX_COLORS_AT_SCORE;
      const quickFeedbackUnlocked =
        state.quickFeedbackUnlocked || nextScore >= QUICK_FEEDBACK_AT_SCORE;

      return {
        ...state,
        status: 'feedback',
        score: nextScore,
        streak: nextStreak,
        bestStreak: Math.max(state.bestStreak, nextStreak),
        activeColorCount: sixColorsUnlocked ? 6 : state.settings.startColorCount,
        lastAnswerCorrect: correct,
        lastPointsDelta: pointsDelta,
        sixColorsUnlocked,
        quickFeedbackUnlocked,
      };
    }

    case 'NEXT_ROUND':
      if (state.status !== 'feedback') {
        return state;
      }
      return {
        ...state,
        status: 'playing',
        round: createRound(state.activeColorCount, state.round),
        roundId: state.roundId + 1,
        lastAnswerCorrect: null,
        lastPointsDelta: null,
      };

    case 'PAUSE':
      if (state.status !== 'playing' && state.status !== 'feedback') {
        return state;
      }
      return {
        ...state,
        remainingMs: Math.max(0, (state.endTimeMs ?? action.now) - action.now),
        endTimeMs: null,
      };

    case 'RESUME':
      if (
        (state.status !== 'playing' && state.status !== 'feedback') ||
        state.endTimeMs !== null
      ) {
        return state;
      }
      return {...state, endTimeMs: action.now + state.remainingMs};

    case 'GO_HOME':
      return createInitialState(state.settings);

    default:
      return state;
  }
}

