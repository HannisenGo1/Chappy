import { useEffect, useState } from 'react';
import openIcon from '../img/open.png';
import closedIcon from '../img/closed.png';
import { SendMessage, Channel, Message } from './interfaces/InterfaceChannel';

interface PrivateChannelsProps {
  currentUser: string; 
}

export const PrivateChannels = ({ currentUser }: PrivateChannelsProps) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [openCategories] = useState<{ [key: string]: boolean }>({
    'Frontend-utveckling': true,
    'Backend-utveckling': true,
    'Allmän diskussion': true,
    'Nyhetsdiskussioner': true,
  });
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>(''); 
  const [mottagare, setMottagare] = useState<string>(''); 

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch('/kanaler');
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
    const categoryChannel = channels.find(channel => channel.topic === categoryName);
    if (categoryChannel) {
      setSelectedChannel(categoryChannel);
      setMessage(null);
    } else {
      setMessage('Ingen kanal tillgänglig i denna kategori');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel) {
      setMessage('Meddelandet måste fyllas i');
      return;
    }

    const messagePayload: SendMessage = {
      topic: selectedChannel.topic,
      message: {
        user: { username: currentUser },
        content: newMessage,
      },
    };

    try {
      const response = await fetch('/kanaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        const addedMessage: Message = {
          user: { username: currentUser }, 
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

  const handleSendDM = async () => {
    if (!newMessage.trim() || !mottagare.trim()) {
      setMessage('Meddelandet och mottagaren måste fyllas i');
      return;
    }

    const messagePayload: SendMessage = {
      topic: `DM till ${mottagare}`, // Använd en specifik topic för DM
      message: {
        user: { username: currentUser },
        content: newMessage,
      },
    };

    // Skicka meddelandet via API
    try {
      const response = await fetch('/kanaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        // Hantera framgångsrik sändning av DM
        setNewMessage('');
        setMottagare('');
        setMessage('Direktmeddelande skickat!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Något gick fel vid sändning av meddelande');
      }
    } catch (error) {
      console.error('Fel vid sändning av DM', error);
      setMessage('Kunde inte skicka DM. Försök igen senare.');
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv ditt meddelande här..."
              />
              <button onClick={handleSendMessage}>Skicka till kanal</button>
            </div>
          </>
        )}
      </div>

      {/* DM-sektion */}
      <div>
        <h3>Skicka Direktmeddelande (DM)</h3>
        <input
          type="text"
          value={mottagare}
          onChange={(e) => setMottagare(e.target.value)}
          placeholder="Mottagare..."
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ditt DM här..."
        />
        <button onClick={handleSendDM}>Skicka DM</button>
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

export default PrivateChannels;
