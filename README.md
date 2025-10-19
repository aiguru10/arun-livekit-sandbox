# Arun LiveKit Sandbox - Electron Application

Complete setup instructions for cloning and running this Electron application from scratch.

## Prerequisites

### 1. Install Node.js and npm
- Download and install Node.js (version 16 or higher) from [nodejs.org](https://nodejs.org/)
- This automatically installs npm (Node Package Manager)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install Git
- Download and install Git from [git-scm.com](https://git-scm.com/)
- Verify installation:
  ```bash
  git --version
  ```

### 3. Code Editor (Optional but Recommended)
- Install [Visual Studio Code](https://code.visualstudio.com/) or your preferred code editor

## Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/aiguru10/arun-livekit-sandbox.git
cd arun-livekit-sandbox
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Install Electron (if not included in dependencies)
```bash
npm install electron --save-dev
```

### Step 4: Install LiveKit Dependencies
```bash
npm install livekit-client livekit-server-sdk
```

### Step 5: Environment Setup
1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

2. Add your LiveKit configuration to `.env`:
   ```
   LIVEKIT_URL=wss://your-livekit-server.com
   LIVEKIT_API_KEY=your-api-key
   LIVEKIT_API_SECRET=your-api-secret
   ```

### Step 6: Build and Run the Application

#### Development Mode
```bash
npm run dev
```
or
```bash
npm start
```

#### Production Build
```bash
npm run build
npm run electron
```

## Project Structure
```
arun-livekit-sandbox/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # Electron renderer process
│   └── shared/         # Shared utilities
├── package.json        # Project dependencies and scripts
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## Common Scripts
- `npm start` - Start the application in development mode
- `npm run dev` - Start with hot reload
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run code linting

## Troubleshooting

### Permission Issues (macOS/Linux)
If you encounter permission errors:
```bash
sudo npm install -g electron
```

### Windows-Specific Issues
- Ensure you're running Command Prompt or PowerShell as Administrator
- If you encounter build errors, install Windows Build Tools:
  ```bash
  npm install --global windows-build-tools
  ```

### Node Version Issues
If you encounter compatibility issues:
```bash
nvm install 18
nvm use 18
```

### Clear Cache (if installation fails)
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## LiveKit Configuration

### Getting LiveKit Credentials
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Copy your API Key and Secret from the project settings
4. Update your `.env` file with the credentials

### Testing Connection
The application will automatically test the LiveKit connection on startup. Check the console for connection status.

## Development Workflow

1. Make your changes in the `src/` directory
2. The application will hot-reload automatically in development mode
3. Test your changes thoroughly
4. Build for production when ready to distribute

## Building for Distribution

### macOS
```bash
npm run build:mac
```

### Windows
```bash
npm run build:win
```

### Linux
```bash
npm run build:linux
```

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed correctly
3. Ensure your LiveKit credentials are valid
4. Check the [LiveKit documentation](https://docs.livekit.io/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request