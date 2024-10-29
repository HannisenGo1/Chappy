import { create } from "zustand";

//  interface för tillståndet
interface StoreState {
    jwt: string | null;
    setJwt: (token: string) => void;
    clearJwt: () => void;
    userId: string | null;
    setUserId: (id: string) => void;
    isLoggedIn: () => boolean;
}

// Skapa Zustand-store med type state
// Initiera jwt från localStorage om den finns
//  sätta JWT-token och spara till localStorage
// Uppdatera Zustand-tillståndet -> spara token.
export const useStore = create<StoreState>((set) => ({
    
    jwt: localStorage.getItem('jwt') || null,
    
    setJwt: (token: string) => {
        set({ jwt: token });             
        localStorage.setItem('jwt', token); 
    },
    
    clearJwt: () => {
        set({ jwt: null });            
        localStorage.removeItem('jwt');  
    },
    
    
    userId: null,
    setUserId: (id: string) => set({ userId: id }), 
    isLoggedIn: () => !!localStorage.getItem('jwt'), 
}));
interface Store {
    isLoggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
}

export const useStorelog = create<Store>((set) => ({
    isLoggedIn: false,
    setLoggedIn: (value) => set({ isLoggedIn: value }),
}));
