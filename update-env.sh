#!/bin/bash
# Script to update Supabase anon key in .env file

echo "🔧 Updating Supabase credentials in .env file..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Prompt for the anon key
echo ""
echo "Please paste your Supabase anon key (from Settings → API → anon public):"
read -r ANON_KEY

# Validate the key format (should be a JWT with 3 parts separated by dots)
if [[ ! "$ANON_KEY" =~ ^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$ ]]; then
    echo "⚠️  Warning: This doesn't look like a valid JWT token format"
    echo "It should have three parts separated by dots (header.payload.signature)"
    echo "Are you sure you want to continue? (y/n)"
    read -r CONFIRM
    if [ "$CONFIRM" != "y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

# Backup the current .env
cp .env .env.backup
echo "✅ Created backup: .env.backup"

# Update the anon key in .env
sed -i '' "s|^VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$ANON_KEY|" .env

echo "✅ Updated .env file with new anon key"
echo ""
echo "To verify the connection, run:"
echo "  node test-supabase.js"
