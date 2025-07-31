import { serverDBEnv } from '@/env/database';

interface DecryptionResult {
  plaintext: string;
  wasAuthentic: boolean;
}

export interface KeyVaultItem {
  accessKey?: string;
  accessKeyId?: string;
  apiKey?: string;
  apiVersion?: string;
  baseURL?: string;
  baseURLOrAccountID?: string;
  region?: string;
  secretAccessKey?: string;
  secretKey?: string;
  sessionToken?: string;
}

type UserKeyVaults = Record<string, KeyVaultItem>;

export class KeyVaultsGateKeeper {
  private aesKey: CryptoKey;

  constructor(aesKey: CryptoKey) {
    this.aesKey = aesKey;
  }

  static initWithEnvKey = async () => {
    const { KEY_VAULTS_SECRET } = serverDBEnv;
    if (!KEY_VAULTS_SECRET)
      throw new Error(
        `\`KEY_VAULTS_SECRET\` is not set, please set it in your environment variables.`,
      );

    const rawKey = Buffer.from(KEY_VAULTS_SECRET, 'base64'); // 确保密钥是32字节（256位）
    const aesKey = await crypto.subtle.importKey(
      'raw',
      rawKey,
      { length: 256, name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    );

    return new KeyVaultsGateKeeper(aesKey);
  };

  /**
   * encrypt user private data
   */
  encrypt = async (keyVault: Record<string, string>): Promise<string> => {
    const str = JSON.stringify(keyVault);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 对于GCM，推荐使用12字节的IV
    const encodedKeyVault = new TextEncoder().encode(str);

    const encryptedData = await crypto.subtle.encrypt(
      {
        iv: iv,
        name: 'AES-GCM',
      },
      this.aesKey,
      encodedKeyVault,
    );

    const buffer = Buffer.from(encryptedData);
    const authTag = buffer.slice(-16); // 认证标签在加密数据的最后16字节
    const encrypted = buffer.slice(0, -16); // 剩下的是加密数据

    return `${Buffer.from(iv).toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  };

  decrypt = async (encryptedData: string): Promise<DecryptionResult> => {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = Buffer.from(parts[2], 'hex');

    // 合并加密数据和认证标签
    const combined = Buffer.concat([encrypted, authTag]);

    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          iv: iv,
          name: 'AES-GCM',
        },
        this.aesKey,
        combined,
      );

      const decrypted = new TextDecoder().decode(decryptedBuffer);
      return {
        plaintext: decrypted,
        wasAuthentic: true,
      };
    } catch {
      return {
        plaintext: '',
        wasAuthentic: false,
      };
    }
  };

  static getUserKeyVaults = async (
    keyVaultsSecret: string,
    encryptedKeyVaults: string | null,
    userId?: string,
  ): Promise<UserKeyVaults> => {
    if (!encryptedKeyVaults) return {};
    // Decrypt keyVaults
    let decryptKeyVaults = {};

    const gateKeeper = await KeyVaultsGateKeeper.initWithEnvKey();
    const { wasAuthentic, plaintext } = await gateKeeper.decrypt(encryptedKeyVaults);

    if (wasAuthentic) {
      try {
        if (!!plaintext) decryptKeyVaults = JSON.parse(plaintext);
      } catch (e) {
        console.error(`Failed to parse keyVaults, userId: ${userId}. Error:`, e);
      }
    }

    return decryptKeyVaults as UserKeyVaults;
  };

  static getUserBudgetKey = async (budgetKey: string) => {
    const gateKeeper = await KeyVaultsGateKeeper.initWithEnvKey();
    let result;

    try {
      result = await gateKeeper.decrypt(budgetKey);
    } catch {
      throw new Error('key failed to  decrypt, please check the program and key');
    }

    if (!result.wasAuthentic)
      throw new Error('key failed to  decrypt, please check the program and key');

    return result.plaintext;
  };
}
