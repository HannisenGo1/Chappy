import { useStore } from './storage/storage';
import { PrivateChannels } from './components/PrivatePage';
import { PublicChannels } from './components/channels';

const App = () => {
  const { isLoggedIn } = useStore();
  
  return (
    <div>
    {isLoggedIn ? <PrivateChannels /> : <PublicChannels />}
    </div>
  );
};

export default App;
