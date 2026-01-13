#!/bin/bash

echo "=================================================="
echo "🔧 CLOUDFLARE TUNNEL PERMANENTE SETUP"
echo "=================================================="
echo ""

# Check of cloudflared geïnstalleerd is
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared is niet geïnstalleerd!"
    echo "Run eerst: wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -O cloudflared && chmod +x cloudflared && sudo mv cloudflared /usr/local/bin/"
    exit 1
fi

echo "✅ cloudflared gevonden!"
echo ""

# Cloudflare account login
echo "📝 Stap 1: Login bij Cloudflare"
echo "Er opent een browser window. Login met je Cloudflare account."
echo "Als je geen account hebt, maak er dan één aan (gratis)."
echo ""
read -p "Druk op Enter om door te gaan..."

cloudflared tunnel login

if [ $? -ne 0 ]; then
    echo "❌ Login gefaald!"
    exit 1
fi

echo ""
echo "✅ Login succesvol!"
echo ""

# Maak tunnel aan
TUNNEL_NAME="telegram-bot-$(date +%s)"
echo "📝 Stap 2: Tunnel aanmaken..."
echo "Tunnel naam: $TUNNEL_NAME"

cloudflared tunnel create $TUNNEL_NAME

if [ $? -ne 0 ]; then
    echo "❌ Tunnel aanmaken gefaald!"
    exit 1
fi

echo ""
echo "✅ Tunnel aangemaakt!"
echo ""

# Haal tunnel ID op
TUNNEL_ID=$(cloudflared tunnel list | grep $TUNNEL_NAME | awk '{print $1}')

if [ -z "$TUNNEL_ID" ]; then
    echo "❌ Kan tunnel ID niet vinden!"
    exit 1
fi

echo "Tunnel ID: $TUNNEL_ID"
echo ""

# Vraag om domein
echo "=================================================="
echo "📝 Stap 3: Domein configuratie"
echo "=================================================="
echo ""
echo "Je hebt 2 opties:"
echo ""
echo "1) Gebruik een GRATIS .trycloudflare.com subdomain"
echo "   Voorbeeld: https://jouw-naam.trycloudflare.com"
echo "   (Geen eigen domein nodig!)"
echo ""
echo "2) Gebruik je EIGEN domein"
echo "   Voorbeeld: https://tiktok-archive.com"
echo "   (Je moet wel een domein bezitten)"
echo ""
read -p "Kies optie (1 of 2): " OPTION

if [ "$OPTION" = "2" ]; then
    echo ""
    read -p "Voer je domein in (bijv. tiktok-archive.com): " DOMAIN

    if [ -z "$DOMAIN" ]; then
        echo "❌ Geen domein ingevoerd!"
        exit 1
    fi

    # Maak DNS record
    echo ""
    echo "📝 DNS record aanmaken..."
    cloudflared tunnel route dns $TUNNEL_NAME $DOMAIN

    if [ $? -ne 0 ]; then
        echo "❌ DNS configuratie gefaald!"
        echo "Zorg ervoor dat je domein bij Cloudflare staat."
        exit 1
    fi

    TUNNEL_URL="https://$DOMAIN"
else
    # Quick tunnel zonder domein
    echo ""
    echo "✅ Je gebruikt een gratis trycloudflare.com subdomain"
    TUNNEL_URL="https://[automatisch-gegenereerd].trycloudflare.com"
fi

echo ""
echo "✅ Domein geconfigureerd!"
echo ""

# Maak config bestand
echo "📝 Stap 4: Configuratie bestand aanmaken..."

mkdir -p ~/.cloudflared

cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /home/$USER/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: "*"
    service: http://localhost:3001
  - service: http_status:404
EOF

echo "✅ Configuratie opgeslagen in ~/.cloudflared/config.yml"
echo ""

# Update .env bestand
echo "📝 Stap 5: .env bestand updaten..."

if [ "$OPTION" = "2" ]; then
    sed -i "s|PUBLIC_URL=.*|PUBLIC_URL=$TUNNEL_URL|g" .env
    echo "✅ .env geupdate met: $TUNNEL_URL"
else
    echo "⚠️  Je moet handmatig de PUBLIC_URL in .env updaten zodra je de tunnel start"
    echo "    De URL wordt getoond als je de tunnel start."
fi

echo ""
echo "=================================================="
echo "✅ SETUP COMPLEET!"
echo "=================================================="
echo ""
echo "🚀 OM DE TUNNEL TE STARTEN:"
echo ""
echo "   cloudflared tunnel run $TUNNEL_NAME"
echo ""
echo "Of gebruik het run script:"
echo "   ./run-tunnel.sh"
echo ""
echo "📝 BELANGRIJK:"
echo "- De tunnel moet blijven draaien (gebruik screen of tmux)"
echo "- De bot moet ook draaien (npm start)"
echo "- Update PUBLIC_URL in .env met de tunnel URL"
echo ""
echo "=================================================="
