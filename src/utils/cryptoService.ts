import crypto from 'react-native-quick-crypto';
import 'react-native-get-random-values';
import { Buffer } from '@craftzdog/react-native-buffer';

const ITERATIONS = 10000;
const KEY_LEN = 32; // AES-256을 위해 32바이트 키 사용
const ALGORITHM = 'aes-256-cbc';

export const cryptoService = {
  // 1. 마스터 비밀번호로 암호화 키 생성 (PBKDF2)
  deriveKey: (password: string, salt: string): Buffer => {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, 'sha256');
  },

  // 2. 데이터 암호화 (AES-256-CBC)
  encrypt: (data: string, key: Buffer) => {
    const iv = crypto.randomBytes(16); // 매번 새로운 초기화 벡터 생성
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      ciphertext: encrypted,
    };
  },

  // 3. 데이터 복호화
  decrypt: (ciphertext: string, key: Buffer, ivHex: string) => {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
};