import { NextApiRequest } from 'next';
import nacl from 'tweetnacl';

/**
 * Verifies the signature of a Discord interaction request.
 * @param request The NextApiRequest object.
 * @param rawBody The raw request body as a string.
 * @returns True if the signature is valid, false otherwise.
 * @throws Error if required environment variables are missing.
 */
export function verifyDiscordRequest(request: NextApiRequest, rawBody: string): boolean {
  const signature = request.headers['x-signature-ed25519'] as string | undefined;
  const timestamp = request.headers['x-signature-timestamp'] as string | undefined;
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!signature || !timestamp || !publicKey) {
    if (!publicKey) {
      console.error('DISCORD_PUBLIC_KEY is not set in environment variables.');
      throw new Error('Missing Discord public key configuration.');
    }
    // Log which header is missing for easier debugging
    if (!signature) console.warn('Missing x-signature-ed25519 header');
    if (!timestamp) console.warn('Missing x-signature-timestamp header');
    return false;
  }

  try {
    return nacl.sign.detached.verify(
      Buffer.from(timestamp + rawBody),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex')
    );
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

// Helper to get raw body, as Next.js parses JSON by default
export async function getRawBody(req: NextApiRequest): Promise<string> {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    return new Promise<string>((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        resolve(Buffer.from(data).toString());
      });
      req.on('error', (err) => {
        reject(err);
      });
    });
  }
  return '';
}
