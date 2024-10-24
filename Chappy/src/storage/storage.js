import { create } from "zustand";

// Hämta token från localStorage om den finns
// Spara token i localStorage
// Ta bort token från localStorage

export const useStore = create((set) => ({
    jwt: localStorage.getItem('jwt') || null, 
    setJwt: (token) => {
        set({ jwt: token });
        localStorage.setItem('jwt', token); 
    },
    clearJwt: () => {
        set({ jwt: null });
        localStorage.removeItem('jwt'); 
    },
    setUserId: (id) => set({ userId: id }),
}));


