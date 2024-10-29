import { useStore } from "../storage/storage";

const LS_KEY = 'JWT-DEMO--TOKEN';
const resultattext = document.getElementById('resultattext') as HTMLParagraphElement | null;
const loginFormContainer = document.getElementById('loginFormContainer') as HTMLDivElement | null;
const loginButton = document.getElementById('loginbtn') as HTMLButtonElement | null;

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
    interface LoginData {
        name: string;
        password: string;
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
        
        interface LoginResponse {
            jwt: string;
        }
        const result: LoginResponse = await response.json();
        const token = result.jwt;
        
        // Spara token i localStorage och Zustand store
        useStore.getState().setJwt(token);
        localStorage.setItem(LS_KEY, token);
        
        if (resultattext) {
            resultattext.innerText = 'Du är nu inloggad';
        }
        
        // Efter inloggning
        await fetchProtectedData(token);
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
    
    
    if (!formVisible) {
        handleLogin();
    }
};


if (loginButton) {
    loginButton.addEventListener('click', toggleLoginForm);
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
            const data = await response.json();
            console.log('Hämtade chattar:', data);
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