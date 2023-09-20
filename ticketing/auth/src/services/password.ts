import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsynt = promisify(scrypt);

export class Password {
    static async toHash (password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsynt(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare (storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');

        const buf = (await scryptAsynt(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }
}