import { useEffect } from "react";
import { useStore } from "../storage/storage";

const Forlogin = () => { 
useEffect(() => {
    const jwt = useStore.getState().jwt; 
  
    if (jwt) {

      useStore.getState().setIsLoggedIn(true);
    } else {

      useStore.getState().setIsLoggedIn(false);
    }
  }, []); 
}

export default Forlogin