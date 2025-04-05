# Lars Workout App

Een webapplicatie voor het bijhouden van Lars's workout routine.

## Functionaliteiten

- Login systeem
- Workout tracking
- Timer voor oefeningen
- Voortgangsweergave
- Nederlandse interface

## Installatie

### Vereisten

- Node.js (v14 of hoger)
- MongoDB
- npm of yarn

### Backend Setup

1. Ga naar de server directory:
```bash
cd server
```

2. Installeer dependencies:
```bash
npm install
```

3. Maak een .env bestand aan met de volgende inhoud:
```
MONGODB_URI=mongodb://localhost:27017/lars-workout
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start de server:
```bash
npm run dev
```

### Frontend Setup

1. Ga naar de client directory:
```bash
cd client
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de development server:
```bash
npm start
```

## Gebruik

1. Open de applicatie in je browser (standaard op http://localhost:3000)
2. Log in met:
   - Gebruikersnaam: Lars
   - Wachtwoord: Nadal2014
3. Begin met je workout!
   - Volg de oefeningen één voor één
   - Gebruik de timer waar aangegeven
   - Klik op "Oefening Voltooien" wanneer je klaar bent

## Deployment naar baselinetopsport.com

### Voorbereiding

1. Zorg ervoor dat je toegang hebt tot de server waar baselinetopsport.com op draait
2. Zorg ervoor dat MongoDB is geïnstalleerd en draait op de server
3. Maak een directory aan op de server: `/var/www/baselinetopsport.com/workout`

### Deployment Stappen

1. Voer het deployment script uit:
```bash
./deploy.sh
```

2. Upload het gegenereerde `lars-workout-app.tar.gz` bestand naar de server

3. Op de server, extraheer het bestand:
```bash
cd /var/www/baselinetopsport.com/workout
tar -xzf lars-workout-app.tar.gz
```

4. Configureer de MongoDB verbinding in `.env.production`

5. Start de applicatie:
```bash
npm start
```

6. Configureer de webserver (Apache/Nginx) om verzoeken naar `/workout` door te sturen naar de Node.js applicatie

### Apache Configuratie

Voeg het volgende toe aan je Apache configuratie:

```apache
<VirtualHost *:80>
  ServerName www.baselinetopsport.com
  
  # Bestaande configuratie...
  
  # Proxy voor de workout app
  ProxyPass /workout/api http://localhost:5000/api
  ProxyPassReverse /workout/api http://localhost:5000/api
  
  # Serveer statische bestanden
  Alias /workout /var/www/baselinetopsport.com/workout/public
  <Directory /var/www/baselinetopsport.com/workout/public>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
  </Directory>
</VirtualHost>
```

### Nginx Configuratie

Voeg het volgende toe aan je Nginx configuratie:

```nginx
server {
  server_name www.baselinetopsport.com;
  
  # Bestaande configuratie...
  
  # Proxy voor de workout app
  location /workout/api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
  
  # Serveer statische bestanden
  location /workout {
    alias /var/www/baselinetopsport.com/workout/public;
    try_files $uri $uri/ /workout/index.html;
  }
}
```

## Technologieën

- React
- Node.js
- Express
- MongoDB
- Material-UI
- JWT voor authenticatie 