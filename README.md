# Arun LiveKit Sandbox

Complete LiveKit application with Python agent backend and React/Electron frontend.

## Architecture Overview

This project consists of three components that work together:
1. **Python Agent** (`agent-starter-python/`) - LiveKit voice AI agent backend
2. **React Web App** (`agent-starter-react/`) - Next.js web interface  
3. **Electron Wrapper** - Desktop application that wraps the React app

## Prerequisites

### 1. Install Python (3.9+)
```bash
python --version  # Should be 3.9 or higher
```
Download from [python.org](https://python.org) if needed.

### 2. Install Node.js (18+) and pnpm
```bash
node --version   # Should be 18 or higher
npm install -g pnpm
pnpm --version
```
Download Node.js from [nodejs.org](https://nodejs.org) if needed.

### 3. Install Git
```bash
git --version
```
Download from [git-scm.com](https://git-scm.com) if needed.

## Setup Instructions

### Step 1: Clone Repository
```bash
git clone https://github.com/aiguru10/arun-livekit-sandbox.git
cd arun-livekit-sandbox
```

### Step 2: Setup Python Agent
```bash
cd agent-starter-python

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Copy environment file and configure
cp .env.example .env
# Edit .env with your LiveKit credentials:
# LIVEKIT_URL=wss://your-livekit-server.com
# LIVEKIT_API_KEY=your-api-key  
# LIVEKIT_API_SECRET=your-api-secret
```

### Step 3: Setup React/Electron App
```bash
cd ../agent-starter-react

# Install dependencies
pnpm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your LiveKit credentials:
# LIVEKIT_URL=wss://your-livekit-server.com
# LIVEKIT_API_KEY=your-api-key
# LIVEKIT_API_SECRET=your-api-secret
```

## Running the Application

You need to run **all three components** in separate terminals:

### Terminal 1: Start Python Agent
```bash
cd agent-starter-python
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
python src/agent.py
```
**Wait for**: "Agent started successfully" message

### Terminal 2: Start React Web App
```bash
cd agent-starter-react
pnpm dev
```
**Wait for**: "Ready - started server on 0.0.0.0:3000"

### Terminal 3: Start Electron Desktop App
```bash
cd agent-starter-react
pnpm run electron
```

## Alternative: One-Command Development
```bash
cd agent-starter-react
pnpm run electron-dev
```
This automatically starts the web app and Electron together (Python agent must still run separately).

## Project Structure
```
arun-livekit-sandbox/
├── agent-starter-python/          # Python LiveKit agent
│   ├── src/agent.py               # Main agent code
│   ├── pyproject.toml             # Python dependencies
│   └── .env                       # Python environment config
├── agent-starter-react/           # React/Electron frontend
│   ├── app/                       # Next.js pages
│   ├── components/                # React components
│   ├── main.js                    # Electron main process
│   ├── package.json               # Node.js dependencies
│   └── .env.local                 # React environment config
├── livekit.md                     # LiveKit documentation
└── electron-implementation-plan.md # Implementation details
```

## LiveKit Configuration

### Get LiveKit Credentials
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Copy API Key and Secret from project settings
4. Update both `.env` files with the same credentials

### Environment Variables
Both `agent-starter-python/.env` and `agent-starter-react/.env.local` need:
```
LIVEKIT_URL=wss://your-project-name-12345678.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Development Workflow

1. **Start Python agent first** - This connects to LiveKit and waits for sessions
2. **Start React web app** - This provides the user interface
3. **Start Electron** - This wraps the web app as a desktop application
4. **Test the connection** - Open the Electron app and verify LiveKit connection

## Production Build

### Build React App
```bash
cd agent-starter-react
pnpm build
```

### Package Electron App
```bash
# macOS
pnpm run build:mac

# Windows  
pnpm run build:win

# Linux
pnpm run build:linux
```

### Deploy Python Agent
```bash
cd agent-starter-python
docker build -t livekit-agent .
docker run -e LIVEKIT_URL=$LIVEKIT_URL -e LIVEKIT_API_KEY=$LIVEKIT_API_KEY -e LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET livekit-agent
```

## Troubleshooting

### Python Issues
```bash
# If pip install fails
pip install --upgrade pip setuptools wheel

# If virtual environment issues
rm -rf .venv
python -m venv .venv
```

### Node.js Issues
```bash
# If pnpm install fails
pnpm cache clean
rm -rf node_modules pnpm-lock.yaml
pnpm install

# If Electron fails to start
pnpm rebuild electron
```

### Connection Issues
1. Verify all three components are running
2. Check LiveKit credentials in both `.env` files
3. Ensure Python agent connects before starting React app
4. Check browser console for errors in Electron app

## Common Scripts

### Python Agent
- `python src/agent.py` - Start the agent
- `pytest` - Run tests

### React/Electron App  
- `pnpm dev` - Start web app in development
- `pnpm build` - Build for production
- `pnpm electron` - Start Electron with built app
- `pnpm electron-dev` - Start web app + Electron together

## Support

If you encounter issues:
1. Ensure all prerequisites are installed
2. Verify LiveKit credentials are correct in both `.env` files
3. Check that Python agent starts successfully before React app
4. Review console logs in all three terminals
5. Check [LiveKit documentation](https://docs.livekit.io/)