type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    electronAPI: {
      getCredentials: () => Promise<{
        LIVEKIT_URL: string;
        LIVEKIT_API_KEY: string;
        LIVEKIT_API_SECRET: string;
      }>;
    };
  }
}

export async function getConnectionDetails(agentName?: string): Promise<ConnectionDetails> {
  console.log('=== getConnectionDetails called ===');
  console.log('agentName:', agentName);

  let LIVEKIT_URL: string;
  let API_KEY: string;
  let API_SECRET: string;

  // Check if running in Electron
  if (typeof window !== 'undefined' && window.electronAPI) {
    console.log('🔐 Getting credentials from Electron secure storage...');
    try {
      const credentials = await window.electronAPI.getCredentials();
      LIVEKIT_URL = credentials.LIVEKIT_URL;
      API_KEY = credentials.LIVEKIT_API_KEY;
      API_SECRET = credentials.LIVEKIT_API_SECRET;
      console.log('✅ Credentials loaded from secure storage');
    } catch (error) {
      console.error('❌ Failed to get credentials from Electron:', error);
      throw new Error('Failed to get credentials from secure storage');
    }
  } else {
    console.log('🌐 Running in browser, using environment variables...');
    LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
    API_KEY = process.env.NEXT_PUBLIC_LIVEKIT_API_KEY || '';
    API_SECRET = process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET || '';
  }

  console.log('Environment variables check:', {
    LIVEKIT_URL: LIVEKIT_URL ? `${LIVEKIT_URL.substring(0, 20)}...` : 'MISSING',
    API_KEY: API_KEY ? `${API_KEY.substring(0, 10)}...` : 'MISSING',
    API_SECRET: API_SECRET ? `${API_SECRET.substring(0, 10)}...` : 'MISSING',
  });

  if (!LIVEKIT_URL || !API_KEY || !API_SECRET) {
    const error = new Error('LiveKit credentials not configured');
    console.error('❌ Credentials missing:', error);
    throw error;
  }

  const participantName = 'user';
  const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
  const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

  console.log('✅ Generated room details:', { participantName, participantIdentity, roomName });

  try {
    console.log('🔑 Starting token generation...');
    const participantToken = await createSimpleToken(
      API_KEY,
      API_SECRET,
      participantIdentity,
      participantName,
      roomName,
      agentName
    );

    console.log('✅ Token generated successfully, length:', participantToken.length);

    const result = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantToken,
      participantName,
    };

    console.log('✅ Connection details ready:', {
      serverUrl: result.serverUrl,
      roomName: result.roomName,
      participantName: result.participantName,
      tokenLength: result.participantToken.length,
    });

    return result;
  } catch (error) {
    console.error('❌ Error in getConnectionDetails:', error);
    throw error;
  }
}

// Simplified token creation for client-side use
// Note: In production, token generation should be done server-side
async function createSimpleToken(
  apiKey: string,
  apiSecret: string,
  identity: string,
  name: string,
  roomName: string,
  agentName?: string
): Promise<string> {
  console.log('🔑 Creating token for:', { identity, name, roomName, agentName });

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    iss: apiKey,
    sub: identity,
    name: name,
    iat: now,
    exp: now + 900, // 15 minutes
    video: {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    },
  };

  // Add room config if agent name is provided
  if (agentName) {
    payload.roomConfig = {
      agents: [{ agentName }],
    };
    console.log('🤖 Added agent config:', agentName);
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;

  try {
    console.log('🔐 Using Web Crypto API for HMAC-SHA256...');
    // Use Web Crypto API for HMAC-SHA256
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(apiSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    const encodedSignature = base64UrlEncode(new Uint8Array(signature));

    const token = `${message}.${encodedSignature}`;
    console.log('✅ Token created successfully');
    return token;
  } catch (error) {
    console.error('❌ Error creating token:', error);
    throw error;
  }
}

function base64UrlEncode(data: string | Uint8Array): string {
  let base64: string;

  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    // Convert Uint8Array to string
    const binary = Array.from(data, (byte) => String.fromCharCode(byte)).join('');
    base64 = btoa(binary);
  }

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
