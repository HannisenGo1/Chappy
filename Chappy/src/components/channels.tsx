import { useEffect, useState } from 'react';

interface Channel {
    name: string;           
    description: string;   
    topic: string;         
    users: any[];           
    isOpen: boolean;        
    messages: any[];       
}

const Channels = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [category, setCategory] = useState<string>('');
    
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
    
    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
    };
    
    
    const filteredChannels = category ? channels.filter(channel => channel.name.toLowerCase().includes(category.toLowerCase()))
    : channels;
    
    
    useEffect(() => {
    }, [category]);
    
    return (
        <div id="channelroomContainer">
        <div>
        <h2>#Frontend</h2>
        <button onClick={() => handleCategoryChange('Frontend')}>Visa Kanaler</button>
        {category === 'Frontend' && filteredChannels.map((channel, index) => (
            <ChannelInfo key={index} channel={channel} />
        ))}
        </div>
        
        <div>
        <h2>#Backend</h2>
        <button onClick={() => handleCategoryChange('Backend')}>Visa Kanaler</button>
        {category === 'Backend' && filteredChannels.map((channel, index) => (
            <ChannelInfo key={index} channel={channel} />
        ))}
        </div>
        
        <div>
        <h2>#Allmänt</h2>
        <button onClick={() => handleCategoryChange('Allmänt')}>Visa Kanaler</button>
        {category === 'Allmänt' && filteredChannels.map((channel, index) => (
            <ChannelInfo key={index} channel={channel} />
        ))}
        </div>
        
        <div>
        <h2>#Nyheter</h2>
        <button onClick={() => handleCategoryChange('Nyheter')}>Visa Kanaler</button>
        {category === 'Nyheter' && filteredChannels.map((channel, index) => (
            <ChannelInfo key={index} channel={channel} />
        ))}
        </div>
        </div>
    );
};

const ChannelInfo = ({ channel }: { channel: Channel }) => {  
    
    return (
        <> 
            <div className="channelsinfo">
                <h2>{channel.name}</h2>
                <p>{channel.description}</p>
                
                
                <div>
                    
                    {channel.messages.length > 0 
                        ? channel.messages.map((message, index) => (
                            <p key={index}>
                                {message.user.username}: {message.content}
                            </p>
                        )) 
                        : 'Inga meddelanden'}
                </div>
            </div> 
        </>
    );
};
        
        export default Channels;
        