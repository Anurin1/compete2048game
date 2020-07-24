// import {config} from "../config/keys"

import {
  getSquares,
  getGameScore,
  isWinningState,
  isLosingState,
  getCurrentState,
  getPreviousGameState,
  getBoardMap,
  getNextGameState,
  getBestScore,
  isKeepPlayingMode,
} from "../selectors";

import { updateSquares } from "./square";
import { updateBoardMap } from "./board";
import {
  updateGameScore,
  updateIsWinning,
  updateIsLosing,
  updateBestScore,
  loadKeepPlayingMode,
} from "./game";
import actions from ".";

export function undo() {
  return (dispatch, getState) => {
    const gameState = getPreviousGameState(getState());

    dispatch(updateGameState(gameState));

    dispatch({ type: "UNDO" });
  };
}

export function redo() {
  return (dispatch, getState) => {
    const gameState = getNextGameState(getState());

    dispatch(updateGameState(gameState));

    dispatch({ type: "REDO" });
  };
}

export function saveGameState() {
  return (dispatch, getState) => {
    const gameState = {
      squares: getSquares(getState()),
      boardMap: getBoardMap(getState()),
      score: getGameScore(getState()),
      bestScore: getBestScore(getState()),
      isWinning: isWinningState(getState()),
      isLosing: isLosingState(getState()),
      keepPlayingMode: isKeepPlayingMode(getState()),
    };

    dispatch({
      type: "SAVE_STATE",
      gameState,
    });

    // Saves game state in a browser local storage.
    localStorage.setItem("compete2048game", JSON.stringify(gameState));
  };
}

export function updateGameState(gameState) {
  return (dispatch, getState) => {
    const {
      squares,
      boardMap,
      score,
      bestScore,
      isWinning,
      isLosing,
      keepPlayingMode,
    } = gameState;

    dispatch(updateSquares(squares));
    dispatch(updateBoardMap(boardMap));
    dispatch(updateGameScore(score));
    dispatch(updateBestScore(bestScore));
    dispatch(updateIsWinning(isWinning));
    dispatch(updateIsLosing(isLosing));
    dispatch(loadKeepPlayingMode(keepPlayingMode));
  };
}

export function saveInitialState() {
  return (dispatch, getState) => {
    const squares = getSquares(getState());
    const boardMap = getBoardMap(getState());

    dispatch({
      type: "SAVE_INITIAL_STATE",
      gameState: {
        squares,
        boardMap,
        score: 0,
        isWinning: false,
        isLosing: false,
        keepPlayingMode: false,
      },
    });
  };
}
