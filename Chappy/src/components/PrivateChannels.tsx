import { useEffect, useState } from 'react'; 
import openIcon from '../img/open.png';

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

const PrivateChannels = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
        'Frontend-utveckling': true,  
        'Backend-utveckling': true,
        'Allmän diskussion': true,
        'Nyhetsdiskussioner': true,
    });
    const [openChannels, setOpenChannels] = useState<{ [key: string]: boolean }>({});
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
        setMessage(null); 
    };
    
    const handleChannelClick = (channelName: string) => {
        
        setOpenChannels(prevState => ({
            ...prevState,
            [channelName]: !prevState[channelName],
        }));
    };
    
    return (
        <div id="channelroomContainer">
        {message && <p style={{ color: 'orange' }}>{message}</p>}
        {Object.keys(openCategories).map((categoryName) => (
            <div key={categoryName}>
            <h2 style={{ cursor: 'pointer' }} onClick={() => handleCategoryClick(categoryName)}>
            {categoryName}
            <img
            src={openIcon} 
            alt="Öppna kanaler"
            style={{ marginLeft: '10px', width: '30px', height: '30px' }}
            />
            </h2>
            {openCategories[categoryName] && (
                <div>
                {channels
                    .filter(channel => channel.topic === categoryName) 
                    .map((channel, index) => (
                        <div key={index}>
                        <h3 style={{ cursor: 'pointer' }} onClick={() => handleChannelClick(channel.name)}>
                        {channel.name}
                        </h3>
                        {openChannels[channel.name] && ( 
                            <ChannelInfo channel={channel} />
                        )}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            ))}
            </div>
        );
    };
    
    const ChannelInfo = ({ channel }: { channel: Channel }) => {
        return (
            <div className="channelsinfo">
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
        