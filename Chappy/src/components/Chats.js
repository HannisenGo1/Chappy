
import { useState } from "react";
import useStore from '../storage/storage.js'; 

const TheChats = () => {
    const [chats, setChats] = useState([]); 
// Hämta token från min store 
    const fetchChats = async () => {
        const token = useStore.getState().jwt; 

        if (!token) {
            console.error('Ingen token hittades, användaren kanske inte är inloggad.');
            return;
        }

        try {
            const response = await fetch('/api/chats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const chatsData = await response.json();
                console.log('Hämtade chattar:', chatsData);
                setChats(chatsData); 
            } else {
                console.error('Åtkomst nekad eller ogiltig token');
            }
        } catch (error) {
            console.error('Fel vid hämtning av chattar:', error);
        }
    };

    return (
        <div>
            <h2>Chattar</h2>
            <button onClick={fetchChats}>Hämta chattar</button>
            {chats.length === 0 ? (
                <p>Inga chattar tillgängliga.</p>
            ) : (
                <ul>
                    {chats.map((chat, index) => (
                        <li key={index}>
                            <strong>Avsändare:</strong> {chat.sender} <br />
                            <strong>Mottagare:</strong> {chat.receiver} <br />
                            <strong>Meddelande:</strong> {chat.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TheChats;
