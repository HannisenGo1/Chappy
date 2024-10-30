import { create } from "zustand";

//  interface för tillstånden
interface StoreState {
    jwt: string | null;
    setJwt: (token: string) => void;
    clearJwt: () => void;
    userId: string | null;
    setUserId: (id: string) => void;
    isLoggedIn: () => boolean;
    
}

// Initiera jwt från localStorage om den finns
// sätta JWT-token och spara till localStorage
// Uppdatera Zustand-tillståndet -> spara token.
export const useStore = create<StoreState>((set) => ({
    
//kontrollera om det finns en giltig jwt token och sätter jwtvärdet, annars null 
// sätter jwt till nytt token och sparar i localStorage så att användaren förblir inloggad =)
// tar bort jwt så att man blir utloggad 
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

// returnerar true om LocalS. innehåller jwt token.
isLoggedIn: () => {
    return !!localStorage.getItem('jwt'); 
},
}));

interface Store {
    isLoggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
}

export const useStorelog = create<Store>((set) => ({
    isLoggedIn: false,
    setLoggedIn: (value) => set({ isLoggedIn: value }),
}));
