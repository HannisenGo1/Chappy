import { create } from "zustand";

// Interface for the store state
interface StoreState {
  jwt: string | null;
  setJwt: (token: string) => void;
  clearJwt: () => void;
  userId: string | null;
  setUserId: (id: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  username: string | null;
  setUsername: (name: string) => void;
  
}

export const useStore = create<StoreState>((set) => ({
  jwt: localStorage.getItem("jwt") || null,

  setJwt: (token: string) => {
    console.log("Setting JWT:", token);
    set({ jwt: token, isLoggedIn: true });
    localStorage.setItem("jwt", token);
  },

  clearJwt: () => {
    console.log("Clearing JWT");
    set({ jwt: null, isLoggedIn: false });
    localStorage.removeItem("jwt");
  },

  userId: null,

  setUserId: (id: string) => {
    console.log("Setting User ID:", id);
    set({ userId: id });
  },

  isLoggedIn: false,

  setIsLoggedIn: (value: boolean) => {
    console.log("Setting isLoggedIn:", value);
    set({ isLoggedIn: value });
  },

  username: null,

  setUsername: (name: string) => {
    console.log("Setting Username:", name);
    set({ username: name });
    
  },
}));
