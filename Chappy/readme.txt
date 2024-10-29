http://localhost:5000


Get/ users 
/api/users
Post 
/api/users/create
name: & password: 

/kanaler
Få ut datan för kanaler
http://localhost:5000/kanaler

POST /kanaler {
  topic: 'Frontend-utveckling',
  message: {
    user: { username: 'Gäst' },
    content: 'Det här är ett testmeddelande'
  }
}

Interfaces: 
