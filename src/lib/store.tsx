"use client";

import React, { createContext, useContext, useReducer, Dispatch } from "react";
import type { Role, Screen } from "@/types";

interface AppState {
  screen: Screen;
  history: Screen[];
  role: Role | null;
  xp: number;
  badges: string[];
}

type Action =
  | { type: "GO"; screen: Screen }
  | { type: "BACK" }
  | { type: "SET_ROLE"; role: Role }
  | { type: "ADD_XP"; amount: number }
  | { type: "ADD_BADGE"; badge: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "GO": {
      const history =
        state.history[state.history.length - 1] !== action.screen
          ? [...state.history, action.screen]
          : state.history;
      return { ...state, screen: action.screen, history };
    }
    case "BACK": {
      if (state.history.length <= 1) return { ...state, screen: "home" };
      const history = state.history.slice(0, -1);
      return { ...state, screen: history[history.length - 1], history };
    }
    case "SET_ROLE":
      return { ...state, role: action.role };
    case "ADD_XP":
      return { ...state, xp: state.xp + action.amount };
    case "ADD_BADGE":
      if (state.badges.includes(action.badge)) return state;
      return { ...state, badges: [...state.badges, action.badge] };
    default:
      return state;
  }
}

const initialState: AppState = {
  screen: "onboarding",
  history: ["onboarding"],
  role: null,
  xp: 620,
  badges: ["Applicant", "Community Joined", "Profile Started"],
};

const StateCtx = createContext<AppState>(initialState);
const DispatchCtx = createContext<Dispatch<Action>>(() => {});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export const useAppState = () => useContext(StateCtx);
export const useDispatch = () => useContext(DispatchCtx);

export function useNav() {
  const dispatch = useDispatch();
  return {
    go: (screen: Screen) => dispatch({ type: "GO", screen }),
    back: () => dispatch({ type: "BACK" }),
  };
}
