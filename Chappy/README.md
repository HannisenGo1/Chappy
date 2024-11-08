

## Build frontend,Run frontend in development mode:
npm run build    
npm run dev


## Start & build backend server:
npm run start-backend       
npm run build-backend


Use for api:
- http://localhost:5000/

---

## Users API

| Method | URL                   | Body                | Response                    |
|--------|------------------------|---------------------|-----------------------------|
| GET    | \/api/users          | -                   | List of users               |
| GET    | \/api/users/{id}     | -                   | User data by ID             |
| POST   | \/api/users/create   | \{ name, password }\  | Created user data           |


#### Fetch All Users
```javascript
const response = await fetch('/api/users', {
    method: 'GET',
    headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json',
    }
});
const users = await response.json();
```

#### Create a New User
```javascript

const response = await fetch('/api/users/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password }),
});
const result = await response.json();
```
---

## Interface for Users

| Property    | Type      | Description       |
|-------------|-----------|-------------------|
| name      | string  | Username          |
| password  | string  | Password          |

---

## Chats API

| Method | URL          | Body                   | Response          |
|--------|--------------|------------------------|-------------------|
| GET    | /api/chats | -                      | List of chats     |
| POST   | /api/chats | \{ sender, receiver, message } | New chat data |


#### Fetch Chats
```javascript
const response = await fetch('/api/chats', {
    method: 'GET',
    headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error fetching chats:', error));
```

#### Send a New Message
```javascript
const response = await fetch('/api/chats', {
    method: 'POST',
    headers: {
        'Authorization': \`Bearer \${Token}\`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sender, receiver, message })
});
```

---

## Interface for Chats

| Property   | Type      | Description        |
|------------|-----------|--------------------|
| sender   | string  | Sender's username  |
| receiver | string  | Receiver's username|
| message  | string  | Message content    |

---

## Channels API

| Method | URL            | Body                                      | Response             |
|--------|-----------------|-------------------------------------------|-----------------------|
| GET    | api/kanaler     | -       | List of channels     |
| POST   | api/kanaler     |{ topic, message: { user, content } }| Created channel data |


#### Fetch Channels
```
const response = await fetch('/api/kanaler');
const channels = await response.json();
```

#### Post a Message to a Channel
```javascript
const response = await fetch('/kanaler', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        topic: 'Frontend Development',
        message: {
            user: { username: 'Guest' },
            content: 'This is a test message'
        }
    })
});
```

---

## Interface for Channels

### Channel Interface
| Property      | Type       | Description             |
|---------------|------------|-------------------------|
| name        | string  | Channel name           |
| description | string   | Channel description    |
| topic       | string   | Channel topic          |
| users     | User[]   | List of users          |
| isOpen      | boolean  | Channel open status    |
| messages    | Message[]| List of messages       |

### SendMessage Interface
| Property      | Type       | Description                |
|---------------|------------|----------------------------|
| topic       | string   | Topic of the message       |
| message     | object   | Message content            |
| username   | string   | Username of the sender     |
| content     | string   | Content of the message     |

---

