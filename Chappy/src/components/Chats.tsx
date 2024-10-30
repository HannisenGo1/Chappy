import { useEffect, useState } from 'react';
import { useStore } from '../storage/storage';

interface Chat {
    sender: string;
    receiver: string;
    message: string;
}

export const Chats = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [filter] = useState<string>(''); 
    const { jwt } = useStore(); 

    useEffect(() => {
        const fetchChats = async () => {
            if (!jwt) return; 
            
            try {
                const response = await fetch('/api/chats', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    }
                });

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
    }, [jwt]); 

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
