# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting Trading Card Game Automated Deployment ---"

# 1. Add Docker's official GPG key and repository
echo "1. Installing Docker..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o                                                                                     /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg                                                                                    ] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" |                                                                                     \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# 2. Install Docker components
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plug                                                                                    in docker-compose-plugin

echo "Docker installed successfully."

# 3. Install Nginx
echo "3. Installing Nginx..."
sudo apt install -y nginx
echo "Nginx installed successfully."

# 4. Create application directories
echo "4. Creating application directories..."
sudo mkdir -p /App/Trading/server # -p creates parent directories if they don't                                                                                     exist
sudo mkdir -p /App/Trading/client
sudo mkdir -p /App/Trading/Nginx-Config # Directory for Nginx config
echo "Application directories created."

# 5. Set working directory to the App root
echo "5. Changing working directory to /App/Trading..."
cd /App/Trading
echo "Current directory: $(pwd)"

# 6. Get the Nginx config (raw file)
echo "6. Downloading Nginx configuration..."
sudo wget -O ./Nginx-Config/trading.conf https://raw.githubusercontent.com/D-Bes                                                                                    t-Apps/Trading-Card-Game/main/Nginx-Config/trading.conf
echo "Nginx config downloaded."

# 7. Place and enable Nginx config
echo "7. Configuring Nginx..."
sudo cp ./Nginx-Config/trading.conf /etc/nginx/sites-available/trading.conf
sudo ln -sf /etc/nginx/sites-available/trading.conf /etc/nginx/sites-enabled/tra                                                                                    ding.conf
sudo rm -f /etc/nginx/sites-enabled/default # Remove default Nginx site if it ex                                                                                    ists
sudo systemctl reload nginx
echo "Nginx configured and reloaded."

cd /App/Trading
mkdir Container

# 8. Get the Docker files and entrypoint file (raw files)
echo "8. Downloading Docker and entrypoint files..."
sudo wget -O ./Dockerfile https://raw.githubusercontent.com/D-Best-Apps/Trading-                                                                                    Card-Game/main/server/Dockerfile
sudo wget -O ./entrypoint.sh https://raw.githubusercontent.com/D-Best-Apps/Tradi                                                                                    ng-Card-Game/main/entrypoint.sh
sudo wget -O ./docker-compose.yml https://raw.githubusercontent.com/D-Best-Apps/                                                                                    Trading-Card-Game/main/docker-compose.yml
echo "Docker files and entrypoint downloaded."

# 9. Download the .env file
echo "9. Downloading .env file..."
sudo wget -O ./.env https://raw.githubusercontent.com/D-Best-Apps/Trading-Card-G                                                                                    ame/main/.env
echo ".env file downloaded."

# 10. Run Docker Compose to build and start the application
echo "10. Building and starting Docker containers..."
docker compose up --build -d
echo "Docker containers started."

echo "--- Deployment Complete! ---"
echo "You should now be able to access the application via Nginx."r
