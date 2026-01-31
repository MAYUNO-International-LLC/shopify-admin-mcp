import { readFileSync } from "fs";
import { z } from "zod";

const CredentialsSchema = z.object({
  shop: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
});

export type Credentials = z.infer<typeof CredentialsSchema>;

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;
let credentials: Credentials | null = null;

export function loadCredentials(): Credentials {
  if (credentials) {
    return credentials;
  }

  const credentialsPath =
    process.env.SHOPIFY_CREDENTIALS_PATH || "./credentials.json";

  try {
    const fileContent = readFileSync(credentialsPath, "utf-8");
    const parsed = JSON.parse(fileContent);
    credentials = CredentialsSchema.parse(parsed);
    return credentials;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load credentials: ${error.message}`);
    }
    throw error;
  }
}

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

export async function getAccessToken(): Promise<string> {
  const credentials = loadCredentials();

  if (cachedToken && cachedToken.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
    return cachedToken.accessToken;
  }

  const tokenUrl = `https://${credentials.shop}/admin/oauth/access_token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to obtain access token: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const tokenData: TokenResponse = await response.json();

  cachedToken = {
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

export function getShopDomain(): string {
  const creds = loadCredentials();
  return creds.shop;
}

export function clearTokenCache(): void {
  cachedToken = null;
}
