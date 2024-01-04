#!/usr/bin/env bash

export NODE=$(which node)

# Go to the BitBar plugins directory
cd "$HOME/Library/Application Support/xbar/plugins/"

# If already installed, check for version updates
if [ -d "xbar-cicd-supervision" ]; then
	cd xbar-cicd-supervision
	echo "Updating xbar-cicd-supervision..."
	git pull origin main --quiet
	echo "Updated successfully."
# If not installed, clone the repository
else
	echo "Downloading xbar-cicd-supervision..."
	git clone https://github.com/anthomarquet/xbar-cicd-supervision --quiet
	echo "Downloaded successfully."
	cd xbar-cicd-supervision
fi

# Install node dependencies
echo "Installing npm dependencies..."
npm install
echo "Dependencies installed."

# Create the symlink if it doesn't exist
cd ..
echo "Creating initialization xbar script..."
echo '#!/bin/bash \n' > xbar-cicd-supervision.5m.sh
echo "cd \"$PWD/xbar-cicd-supervision/\"" >> xbar-cicd-supervision.5m.sh
echo "$NODE \"$PWD/xbar-cicd-supervision/bin/cli.js\"" >> xbar-cicd-supervision.5m.sh
chmod +x xbar-cicd-supervision.5m.sh

echo "Done."	