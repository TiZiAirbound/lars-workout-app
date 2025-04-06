#!/bin/bash
# Verwijder oude build
rm -rf build

# Maak tijdelijke package.json
echo '{
  "name": "client",
  "version": "0.1.0",
  "private": true
}' > temp-package.json

# Backup originele package.json
mv package.json package.json.bak
mv temp-package.json package.json

# Run build
PUBLIC_URL=/ REACT_APP_BASE_PATH=/ npm run build

# Herstel originele package.json
mv package.json.bak package.json 