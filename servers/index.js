const http = require('http');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;
const usersFile = path.join(__dirname, 'data', 'users.json');
const readUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving users:', error);
        throw error;
    }
};
function getUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Erreur de lecture du fichier users.json:", err);
        return [];
    }
}
function parseBody(req, callback) { 
    let body = ''; 
    req.on('data', chunk => body += chunk); 
    req.on('end', () => callback(JSON.parse(body))); 
}
const server = http.createServer((req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }
    if (req.url === '/users' && req.method === 'GET') {
        try {
            const users = readUsers();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(users));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({error: 'Erreur serveur'}));
            }
        return;
    }
    if (req.url === '/register' && req.method === 'POST') {
        parseBody(req, (userData) => {
            const users = getUsers();
            const exists = users.find(u => u.email === userData.email);
            if (exists) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Email déjà utilisé' }));
            }
            bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Erreur lors du hash du mot de passe" }));
                }
                const newUser = {
                    id: uuidv4(),
                    email: userData.email,
                    password: hashedPassword
                };
                users.push(newUser);
                saveUsers(users);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Inscription réussie' }));
            });
        });
    } 
    else if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { email, password } = JSON.parse(body);
                const users = readUsers();
                const user = users.find(u => u.email === email);
                
                if (!user) {
                    res.writeHead(401);
                    return res.end(JSON.stringify({ error: 'Email ou mot de passe incorrect' }));
                }
                
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    res.writeHead(401);
                    return res.end(JSON.stringify({ error: 'Email ou mot de passe incorrect' }));
                }
            
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }));
            
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Erreur serveur' }));
            }
        });
    }
    else { 
        res.writeHead(404); 
        res.end(); 
    } 
});
server.listen(3000, () => { 
    console.log('Serveur démarré sur http://localhost:3000'); 
});