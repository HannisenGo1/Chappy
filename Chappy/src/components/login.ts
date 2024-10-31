import { useStore } from "../storage/storage";

//const LS_KEY = 'JWT-DEMO--TOKEN';
const resultattext = document.getElementById('resultattext') as HTMLParagraphElement | null;
const resultattext2 = document.getElementById('resultattext2') as HTMLParagraphElement | null; // Rätt referens här
const loginFormContainer = document.getElementById('loginFormContainer') as HTMLDivElement | null;
const loginButton = document.getElementById('loginbtn') as HTMLButtonElement | null;
let currentUser: string | null = null; 
let formVisible = false;

interface LoginResponse {
    jwt: string;
    name: string; 
}
interface Chat {
    sender: string;
    receiver: string;
    message: string;
}
interface LoginData {
    name: string;
    password: string;
}

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
        
        console.log('Response status:', response.status);
        if (response.status !== 200) {
            if (resultattext) {
                resultattext.innerText = 'Inloggning misslyckades, försök igen';
            }
            return;
        }
        
        const result: LoginResponse = await response.json();
        currentUser = result.name; 
        
        if (resultattext2) {
            resultattext2.style.display = 'block'; 
            resultattext2.innerText = `Välkommen ${currentUser}!`; 
        }
        
        if (loginFormContainer) {
            loginFormContainer.style.display = 'none'; 
        }
        
        const fetchChatsButton = document.createElement('button');
        fetchChatsButton.innerText = 'Hämta Chattarna';
        fetchChatsButton.id = 'fetchChatsButton';
        
        
        fetchChatsButton.addEventListener('click', async () => {
            await fetchProtectedData(result.jwt);
        });
        
        const buttonContainer = document.getElementById('loginFormContainer'); 
        if (buttonContainer) {
            buttonContainer.appendChild(fetchChatsButton);
        }
        
        // Kontrollerar behörigheten 
        await fetchProtectedData(result.jwt);
    } catch (error) {
        if (resultattext) {
            resultattext.innerText = 'Ett fel uppstod vid inloggningen';
        }
        console.error('Error:', error);
    }
};



export const toggleLoginForm = (): void => {
    formVisible = !formVisible;
    
    if (loginFormContainer) {
        loginFormContainer.style.display = formVisible ? 'block' : 'none';
    }
};

if (loginButton) {
    loginButton.addEventListener('click', async () => {
        if (!formVisible) {
            toggleLoginForm();
        } else {
            await handleLogin();
        }
    });
}

// Fetch skyddade data med JWT-token
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



// Fetch user data använder JWT token
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
        if (!userDiv) return;
        
        userDiv.innerHTML = '';
        
        userData.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('userinfo');
            
            const userName = document.createElement('h2');
            userName.innerText = user.name;
            
            userElement.appendChild(userName);
            userDiv.appendChild(userElement);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
