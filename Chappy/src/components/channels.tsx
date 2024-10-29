import { useEffect, useState } from 'react';
import openIcon from '../img/open.png';
import closedIcon from '../img/closed.png';

// Kanaldatatyper 
export interface Channel {
  name: string;
  description: string;
  topic: string; 
  users: any[];
  isOpen: boolean;
  messages: {
    user: { username: string };
    content: string;
  }[];
}

export const PublicChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
    'Frontend-utveckling': true,
    'Backend-utveckling': false,
    'Allmän diskussion': true,
    'Nyhetsdiskussioner': false,
  });
  const [openChannels, setOpenChannels] = useState<{ [key: string]: boolean }>({});
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null); // Ny state för vald kanal
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/kanaler');
        if (!response.ok) {
          throw new Error(`HTTP error! ${response.status}`);
        }

        const channelData: Channel[] = await response.json();
        setChannels(channelData);
      } catch (error) {
        console.error('Fel vid hämtning av kanaler:', error);
      }
    };

    fetchChannels();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (!openCategories[categoryName]) {
      setMessage('Du måste logga in för att öppna denna kanalen');
      return;
    }
    setMessage(null); 
  };

  const handleChannelClick = (channelName: string) => {
    const channel = channels.find(c => c.name === channelName);
    setSelectedChannel(channel || null); 
    setOpenChannels(prevState => ({
      ...prevState,
      [channelName]: !prevState[channelName],
    }));
  };

  return (
    <div id="channelroomContainer">
      <div>
        {message && <p style={{ color: 'orange' }}>{message}</p>}
        {Object.keys(openCategories).map((categoryName) => (
          <div key={categoryName}>
            <h2 style={{ cursor: openCategories[categoryName] ? 'pointer' : 'default' }} onClick={() => handleCategoryClick(categoryName)}>
              {categoryName}
              <img
                src={openCategories[categoryName] ? openIcon : closedIcon}
                alt={openCategories[categoryName] ? 'Öppna kanaler' : 'Stängda kanaler'}
                style={{ marginLeft: '10px', width: '30px', height: '30px' }}
              />
            </h2>
            {openCategories[categoryName] && (
              <div id="openchannelcontainer">
                {channels
                  .filter(channel => channel.topic === categoryName) 
                  .map((channel, index) => (
                    <div key={index}>
                      <h3 style={{ cursor: 'pointer' }} onClick={() => handleChannelClick(channel.name)}>
                        {channel.name}
                      </h3>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        {selectedChannel && <ChannelInfo channel={selectedChannel} />}
      </div>
    </div>
  );
};

const ChannelInfo = ({ channel }: { channel: Channel }) => {
  return (
    <div className="channelsinfo">
      <h3>{channel.name}</h3> 
      <p>{channel.description}</p>
      <div>
        {channel.messages.length > 0
          ? channel.messages.map((message, index) => (
              <p key={index}>
                <strong>{message.user.username}:</strong> {message.content}
              </p>
            ))
          : <p>Inga meddelanden</p>}
      </div>
    </div>
  );
};

export default PublicChannels;
