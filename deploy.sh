#!/bin/bash

# TouchPay Docs Server Deployment Script for VPS Hostinger
# Make sure to run this script on your VPS

echo "Starting TouchPay Docs Server deployment..."

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm (if not already installed)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Install nginx (if not already installed)
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt install nginx -y
fi

# Create application directory
echo "Setting up application directory..."
sudo mkdir -p /var/www/touchpay-docs-server
sudo chown $USER:$USER /var/www/touchpay-docs-server

# Navigate to application directory
cd /var/www/touchpay-docs-server

# Clone the repository (if not already done)
if [ ! -d ".git" ]; then
    echo "Cloning repository..."
    git clone https://github.com/thefrozenberry/touchpay-docs-server.git .
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file (you'll need to edit this with your actual values)
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
EOF
    echo "Please edit the .env file with your actual MongoDB connection string"
fi

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo "Deployment completed!"
echo "Your application should now be running on port 5000"
echo "Don't forget to:"
echo "1. Edit the .env file with your MongoDB connection string"
echo "2. Configure nginx as reverse proxy (see nginx.conf)"
echo "3. Setup SSL certificate if needed" 