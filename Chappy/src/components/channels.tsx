import { useEffect, useState } from 'react';
import openIcon from '../img/open.png';
import closedIcon from '../img/closed.png';
import {  SendMessage,Channel,Message   } from './interfaces/InterfaceChannel';



export const PublicChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [openCategories] = useState<{ [key: string]: boolean }>({
    'Frontend-utveckling': true,
    'Backend-utveckling': false,
    'Allmän diskussion': true,
    'Nyhetsdiskussioner': false,
  });
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(''); 
  const [newMessage, setNewMessage] = useState<string>(''); 
  
  
  
  
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/api/kanaler');
        if (!response.ok) {
          throw new Error(`HTTP error! ${response.status}`);
        }
        
        const channelData: Channel[] = await response.json();
        console.log('Hämtade kanaler:', channelData);
        setChannels(channelData);
      } catch (error) {
        console.error('Fel vid hämtning av kanaler:', error);
      }
    };
    
    fetchChannels();
  }, []);
  
  const handleCategoryClick = (categoryName: string) => {
    if (!openCategories[categoryName]) {
      setMessage('Du måste logga in för att öppna kanalen');
      return;
    }
    setMessage(null);
    
    const categoryChannel = channels.find(channel => channel.topic === categoryName);
    if (categoryChannel) {
      setSelectedChannel(categoryChannel);
    } else {
      setMessage('Ingen kanal tillgänglig i denna kategori');
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !username.trim()) {
      setMessage('Både namn och meddelande måste fyllas i');
      return;
    }
    
    const messagePayload: SendMessage = {
      topic: selectedChannel.topic,
      message: {
        user: { username },
        content: newMessage,
      },
    };
    
    try {
      const response = await fetch('/api/kanaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });
      
      if (response.ok) {
        const addedMessage: Message = {
          user: { username },
          content: newMessage,
        };
        
        setSelectedChannel(prevChannel => {
          const updatedChannel = prevChannel as Channel; 
          return {
            ...updatedChannel,
            messages: [...updatedChannel.messages, addedMessage],
          };
        });
        setNewMessage('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Något gick fel vid sändning av meddelande');
      }
    } catch (error) {
      console.error('Fel vid sändning av meddelande', error);
      setMessage('Kunde inte skicka meddelande. Försök igen senare.');
    }
  };
  
  return (
    <div id="channelroomContainer">
    <div>
    {message && <p style={{ color: 'orange' }}>{message}</p>}
    {Object.keys(openCategories).map((categoryName) => (
      <div key={categoryName}>
      <h2
      style={{ cursor: 'pointer' }}
      onClick={() => handleCategoryClick(categoryName)}
      >
      {categoryName}
      <img
      src={openCategories[categoryName] ? openIcon : closedIcon}
      alt={openCategories[categoryName] ? 'Öppna kanaler' : 'Stängda kanaler'}
      style={{ marginLeft: '10px', width: '30px', height: '30px' }}
      />
      </h2>
      </div>
    ))}
    </div>
    
    <div>
    {selectedChannel && (
      <>
      <ChannelInfo channel={selectedChannel} />
      
      <div className="sendMessageForm">
      <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Ange ditt namn..."
      />
      <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Skriv ditt meddelande här..."
      />
      <button onClick={handleSendMessage}>Skicka</button>
      </div>
      </>
    )}
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
  