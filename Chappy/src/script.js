const LS_KEY = 'JWT-DEMO--TOKEN';
const loginbtn = document.querySelector('#loginbtn');
const signupbtn = document.querySelector('#signupbtn');
const resultattext = document.getElementById('resultattext'); 

loginbtn.addEventListener('click', async () => {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const data = { username, password };

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    });

    if (response.status !== 200) {
        resultattext.innerText = 'Please login again';
        return;
    }
    
    const token = await response.json();
    localStorage.setItem(LS_KEY, token.jwt);
    resultattext.innerText = 'You are logged in';
});

document.getElementById('datan').addEventListener('click', getUser);

async function getUser() {
    try {
        const response = await fetch('/api/users', { method: 'GET' }); 
        if (!response.ok) {
            console.error("Failed:", response.status);
            return;
        }
        
        const userData = await response.json();
        console.log('Svar från servern: ', userData);

        const productDiv = document.getElementById('userContainer');
        productDiv.innerHTML = ''; 

        userData.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('userinfo');

            const userName = document.createElement('h2');
            userName.innerText = user.name;

            userDiv.appendChild(userName);
            productDiv.appendChild(userDiv);
        });
    } catch (error) {
        console.error("Error fetching the user:", error);
    }
}
