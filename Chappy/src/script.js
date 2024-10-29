const LS_KEY = 'JWT-DEMO--TOKEN';
// const signupbtn = document.querySelector('#signupbtn');

import { handleLogin, getUser} from './components/login';


const loginbtn = document.querySelector('#loginbtn');

loginbtn.addEventListener('click', handleLogin);


document.getElementById('datan').addEventListener('click', getUser);




