const LS_KEY = 'JWT-DEMO--TOKEN';
// const signupbtn = document.querySelector('#signupbtn');
const loginbtn = document.querySelector('#loginbtn');
//const logoutbtn = document.querySelector('#logoutbtn'); 
//const signupbtn = document.querySelector('#signupbtn'); 
//const deleteAccountBtn = document.querySelector('#deleteAccountBtn');
import { handleLogin, getUser} from './components/login';



loginbtn.addEventListener('click', handleLogin);


document.getElementById('datan').addEventListener('click', getUser);


