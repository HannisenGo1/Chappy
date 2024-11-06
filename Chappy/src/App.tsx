import { useStore } from './storage/storage';
import { PrivateChannels } from './components/PrivatePage';
import { PublicChannels } from './components/channels';
import { getUser, fetchProtectedData } from './components/login';
import { useEffect, useState } from 'react';
import { CreateUser } from './components/credelUser';

const App = () => {
  const { isLoggedIn } = useStore(); 
  const token = useStore.getState().jwt; 
  const [showCreateUser, setShowCreateUser] = useState(false); 
  
  useEffect(() => {
    if (token) {
      getUser(); 
      fetchProtectedData(token); 
    }
  }, [token]);

  const toggleCreateUserForm = () => {
    setShowCreateUser(!showCreateUser); 
  };

  return (
    <div>
  
      {isLoggedIn ? <PrivateChannels /> : <PublicChannels />}

     
      {!isLoggedIn && showCreateUser && <CreateUser />}
      

   
      <div id="userContainer"></div>
      <div id="chatContainer"></div>

       {!isLoggedIn && (
        <footer>
          <button id="signupbtn" onClick={toggleCreateUserForm}>
            {showCreateUser ? 'Tillbaka' : 'Skapa konto'}
          </button>
        </footer>
      )}
    </div>
  );
};

export default App;



