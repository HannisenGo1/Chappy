import { useEffect, useState } from 'react';

interface Chat {
  sender: string;
  receiver: string;
  message: string;
}

const Chats = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [filter, setFilter] = useState<string>(''); 

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch('/api/chats');
                if (!response.ok) {
                    throw new Error(`HTTP error! ${response.status}`);
                }

                const chatData: Chat[] = await response.json();
                setChats(chatData);
            } catch (error) {
                console.error('Fel vid hämtning av chattar:', error);
            }
        };

        fetchChats();
    }, []);



    const filteredChats = filter
        ? chats.filter(chat =>
            chat.sender.toLowerCase().includes(filter.toLowerCase()) ||
            chat.receiver.toLowerCase().includes(filter.toLowerCase()) ||
            chat.message.toLowerCase().includes(filter.toLowerCase())
          )
        : chats;

    return (
        <div id="chatContainer">
            <h2>Chattar</h2>
            
                <ul>
                    {filteredChats.map((chat, index) => (
                        <li key={index}>
                            <strong>Avsändare:</strong> {chat.sender} <br />
                            <strong>Mottagare:</strong> {chat.receiver} <br />
                            <strong>Meddelande:</strong> {chat.message}
                        </li>
                    ))}
                </ul>
            
        </div>
    );
};

export default Chats;