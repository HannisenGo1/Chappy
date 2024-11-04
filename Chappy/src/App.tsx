import { useStore } from './storage/storage';
import { PrivateChannels } from './components/PrivatePage';
import { PublicChannels } from './components/channels';
import { getUser, fetchProtectedData } from './components/login'
import { useEffect } from 'react';

const App = () => {
  const { isLoggedIn } = useStore();
  const token = useStore.getState().jwt;
  useEffect(() => {
    if (token) {
      getUser(); 
      fetchProtectedData(token); 
    }
  }, [token]);
  
  return (
    <div>
    {isLoggedIn ? <PrivateChannels /> : <PublicChannels />}
    <div id="userContainer"></div>
    <div id="chatContainer"></div>
    
    
    
    </div>
  );
};

export default App;
