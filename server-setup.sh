#!/bin/bash

# Exit on error
set -e

echo "Setting up the server for Lars Workout App..."

# Create necessary directories
echo "Creating directories..."
mkdir -p /var/www/baselinetopsport.com/workout

# Install MongoDB if not already installed
if ! command -v mongod &> /dev/null; then
  echo "Installing MongoDB..."
  # For Ubuntu/Debian
  if command -v apt-get &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
  # For CentOS/RHEL
  elif command -v yum &> /dev/null; then
    echo "[mongodb-org-5.0]" | sudo tee /etc/yum.repos.d/mongodb-org-5.0.repo
    echo "name=MongoDB Repository" | sudo tee -a /etc/yum.repos.d/mongodb-org-5.0.repo
    echo "baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/5.0/x86_64/" | sudo tee -a /etc/yum.repos.d/mongodb-org-5.0.repo
    echo "gpgcheck=1" | sudo tee -a /etc/yum.repos.d/mongodb-org-5.0.repo
    echo "enabled=1" | sudo tee -a /etc/yum.repos.d/mongodb-org-5.0.repo
    sudo yum install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
  else
    echo "Unsupported OS for automatic MongoDB installation. Please install MongoDB manually."
  fi
else
  echo "MongoDB is already installed."
fi

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
  echo "Installing Node.js..."
  # For Ubuntu/Debian
  if command -v apt-get &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
  # For CentOS/RHEL
  elif command -v yum &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
  else
    echo "Unsupported OS for automatic Node.js installation. Please install Node.js manually."
  fi
else
  echo "Node.js is already installed."
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  sudo npm install -g pm2
else
  echo "PM2 is already installed."
fi

# Create a systemd service for the app
echo "Creating systemd service..."
cat > /etc/systemd/system/lars-workout.service << EOF
[Unit]
Description=Lars Workout App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/baselinetopsport.com/workout
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
sudo systemctl daemon-reload

echo "Server setup complete!"
echo "Next steps:"
echo "1. Upload the deployment package to /var/www/baselinetopsport.com/workout"
echo "2. Extract the package and configure .env.production"
echo "3. Start the service with: sudo systemctl start lars-workout"
echo "4. Enable the service with: sudo systemctl enable lars-workout"
echo "5. Configure your web server (Apache/Nginx) as described in the README" 