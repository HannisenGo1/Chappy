export type UserId = string;

export interface User {
    name: string;
    id: UserId;
    password: string;
}

// validera inloggning mot servern
async function validateLogin(name: string, password: string): Promise<UserId | null> {
    const data = { name, password };
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.status === 200) {
            const result = await response.json();
            return result.userId; 
        } else {
            console.log('Invalid username or password');
            return null;
        }
    } catch (error) {
        console.error('Error during login:', error);
        return null;
    }
}

// hämta användardata från servern med ID
async function getUserData(userId: UserId): Promise<User | null> {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 200) {
            const user = await response.json();
            return user;
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export { validateLogin, getUserData };
