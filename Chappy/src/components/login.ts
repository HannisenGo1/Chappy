import { useStore } from "../storage/storage";
import { LoginResponse, Chat, LoginData } from "./interfaces/interfaceLogin";

const resultattext = document.getElementById('resultattext') as HTMLParagraphElement | null;
const resultattext2 = document.getElementById('resultattext2') as HTMLParagraphElement | null;
const loginFormContainer = document.getElementById('loginFormContainer') as HTMLDivElement | null;
const loginButton = document.getElementById('loginbtn') as HTMLButtonElement | null;
let currentUser: string | null = null; 
let formVisible = false;

export const handleLogin = async (): Promise<void> => {
    const username = (document.querySelector('#username') as HTMLInputElement)?.value;
    const password = (document.querySelector('#password') as HTMLInputElement)?.value;
    
    if (!username || !password) {
        if (resultattext) {
            resultattext.innerText = 'Användarnamn och lösenord måste anges';
        }
        return;
    }
    
    const data: LoginData = { name: username, password };
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.status !== 200) {
            if (resultattext) {
                resultattext.innerText = 'Inloggning misslyckades, försök igen';
            }
            return;
        }
        
        const result: LoginResponse = await response.json();
        currentUser = result.name; 
        useStore.getState().setJwt(result.jwt); 
        useStore.getState().setIsLoggedIn(true);
        
        if (resultattext2) {
            resultattext2.style.display = 'block'; 
            resultattext2.innerText = `Välkommen ${currentUser}!`; 
        }
        
        if (loginFormContainer) {
            loginFormContainer.style.display = 'none'; 
        }
        const messageContainer = document.getElementById('messageContainer') as HTMLDivElement | null;
        if (messageContainer) {
            messageContainer.style.display = 'block'; 
        }
        
        await fetchProtectedData(result.jwt); 
        
    } catch (error) {
        if (resultattext) {
            resultattext.innerText = 'Ett fel uppstod vid inloggningen';
        }
        console.error('Error:', error);
    }
};


export const handleLogout = (): void => {
    useStore.getState().clearJwt(); 
    currentUser = null; 
};

export const toggleLoginForm = (): void => {
    formVisible = !formVisible;
    
    if (loginFormContainer) {
        loginFormContainer.style.display = formVisible ? 'block' : 'none';
    }
};

//  hämta skyddade data med JWT
export const fetchProtectedData = async (token: string): Promise<void> => {
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
            const data: Chat[] = await response.json();
            console.log('Hämtade chattar:', data);
            const chatContainer = document.getElementById('chatContainer') as HTMLDivElement | null;
            if (chatContainer) {
                chatContainer.style.display = 'block'; 
                chatContainer.innerHTML = ''; 
                const userChats = data.filter(chat => 
                    chat.sender === currentUser || chat.receiver === currentUser
                );
                
                userChats.forEach((chat: Chat) => {
                    const chatElement = document.createElement('div');
                    chatElement.classList.add('chat-item');
                    chatElement.innerText = `${chat.sender} till ${chat.receiver}: ${chat.message}`;
                    chatContainer.appendChild(chatElement);
                });
            }
        } else {
            console.error('Fel vid hämtning av skyddade data.');
        }
    } catch (error) {
        console.error('Fel vid hämtning av chattar:', error);
    }
};

// Användardatan
export const getUser = async (): Promise<void> => {
    const token = useStore.getState().jwt;
    
    if (!token) {
        console.error('Ingen token hittades, användaren kanske inte är inloggad.');
        return;
    }
    
    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! ${response.status}`);
        }
        
        const userData: { name: string }[] = await response.json();
        console.log('Svar från servern: ', userData);
        
        const userDiv = document.getElementById('userContainer') as HTMLDivElement | null;
        const receiverSelect = document.getElementById('receiverSelect') as HTMLSelectElement | null;
        
        if (!userDiv || !receiverSelect) return;
        
        userDiv.innerHTML = '';
        receiverSelect.innerHTML = ''; 
        
        userData.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('userinfo');
            const userName = document.createElement('h2');
            userName.innerText = user.name;
            userElement.appendChild(userName);
            userDiv.appendChild(userElement);
            //dropdown
            const option = document.createElement('option');
            option.value = user.name; 
            option.textContent = user.name; 
            receiverSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


export const sendMessage = async (receiver: string, message: string) => {
    const token = useStore.getState().jwt;
    
    if (!token) {
        console.error('Ingen token hittades, användaren kanske inte är inloggad.');
        return;
    }
    const data = {
        sender: currentUser, 
        receiver: receiver,   
        message: message,    
    };
    
    try {
        const response = await fetch('/api/chats', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! ${response.status}`);
        }
        
        console.log('Meddelandet har skickats.');
        
        fetchProtectedData(token);
    } catch (error) {
        console.error('Fel vid sändning av meddelande:', error);
    }
};

if (loginButton) {
    loginButton.addEventListener('click', async () => {
        if (!formVisible) {
            toggleLoginForm();
        } else {
            await handleLogin();
            await getUser();
        }
    });
}

const sendMessageButton = document.getElementById('sendMessageBtn') as HTMLButtonElement | null;

if (sendMessageButton) {
    sendMessageButton.addEventListener('click', async () => {
        const receiverSelect = document.getElementById('receiverSelect') as HTMLSelectElement | null;
        const messageInput = document.getElementById('messageInput') as HTMLInputElement | null;
        
        if (receiverSelect && messageInput) {
            const receiverId = receiverSelect.value;
            const message = messageInput.value;
            
            if (!receiverId || !message) {
                console.error('Vänligen välj en mottagare och skriv ett meddelande.');
                return;
            }
            
            await sendMessage(receiverId, message);
            messageInput.value = '';
        }
    });
}
