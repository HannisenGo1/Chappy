http://localhost:5000

# Användning av Api

/api/users
      [Method-Get] - Få ut användare.
      const response = await fetch('/api/users', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  }
              });
      [Method-Post]  - Skapa en användare.
      const response = await fetch('/api/users/create', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ name, password }),
                  });
                  const result = await response.json();
# Interface för users    
{
    "name": string;
    "password": string;
} 

# API Chats
/api/chats
      [Method-Get]
      const response = fetch('/api/chats', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Fel vid hämtning av chattar:', error));

      [Method-Post]
      const response = await fetch('/api/chats', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${Token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                    })
# Interfaces för chats: 
const data = {
  sender: string;
  receiver: string;
  message: string;
};

/kanaler
        [Method-Get]
        const response = await fetch('/kanaler');
        [Post/kanaler]{
          topic: 'Frontend-utveckling',
          message: {
            user: { username: 'Gäst' },
            content: 'Det här är ett testmeddelande'
          }
        }
# Interface för kanaler & skriva meddelande
interface Channel {
    name: string;
    description: string;
    topic: string;
    users: User[];
    isOpen: boolean; 
    messages: Message[]; 
}
interface SendMessage {
    topic: string;
    message: {
        user: {
            username: string;
        };
        content: string;
    };
}

