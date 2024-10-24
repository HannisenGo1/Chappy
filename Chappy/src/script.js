const LS_KEY = 'JWT-DEMO--TOKEN';
const loginbtn = document.querySelector('#loginbtn');
// const signupbtn = document.querySelector('#signupbtn');
const resultattext = document.getElementById('resultattext'); 
import {useStore} from './storage/storage.js' 
import {validateLogin} from './components/users'

loginbtn.addEventListener('click', async () => {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const data = { name: username, password }; 
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.status !== 200) {
            resultattext.innerText = 'Inloggning misslyckades, försök igen';
            return;
        }
        
        const result = await response.json();
        const token = result.jwt; 
        
        // Zustand store för att spara token
        const setJwt = useStore.getState().setJwt;
        setJwt(token);
        
        resultattext.innerText = 'Du är nu inloggad';
        
        await fetchProtectedData(); 
    } catch (error) {
        resultattext.innerText = 'Ett fel uppstod vid inloggningen';
        console.error('Error:', error);
    }
});
const handleLogin = async () => {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const userId = await validateLogin(username, password);
    
    if (userId) {
        console.log('Inloggad med ID:', userId);
 
        useStore.getState().setUserId(userId); 
        const userData = await getUserData(userId);
        console.log('Användardata:', userData);
    } else {
        console.log('Inloggning misslyckades.');
    }
};
handleLogin();

// Hämta token från Zustand store
async function fetchProtectedData() {
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
            const data = await response.json();
            console.log('Hämtade chattar:', data);
            return data; 
            
        } else {
            resultattext.innerText = 'Åtkomst nekad eller ogiltig token';
        }
    } catch (error) {
        console.error('Fel vid hämtning av chattar:', error);
        resultattext.innerText = 'Fel vid hämtning av chattar';
    }
}

document.getElementById('datan').addEventListener('click', getUser);




export async function getUser() {
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
        
        const userData = await response.json(); 
        console.log('Svar från servern: ', userData);
        
        const userDiv = document.getElementById('userContainer');
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
}


