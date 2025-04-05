#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the React app
echo "Building React app..."
cd client
npm install
npm run build
cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd ../server
npm install
cd ../lars-workout-app

# Create production build directory
echo "Creating production build..."
mkdir -p production
cp -r ../server/* production/
cp -r client/build production/public

# Compress the production build
echo "Compressing production build..."
tar -czf lars-workout-app.tar.gz -C production .

echo "Deployment package created: lars-workout-app.tar.gz"
echo "Upload this file to your server and extract it to the appropriate directory."
echo "Then run 'npm start' in the production directory on your server." 