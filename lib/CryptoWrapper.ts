import { CryptoUtils } from './CnUtils';
import { Config } from './Config';

const nullKey = '0'.repeat(64);

export async function generateKeyDerivation(
    transactionPublicKey: string,
    privateViewKey: string): Promise<string> {

    if (Config.generateKeyDerivation) {
        return Config.generateKeyDerivation(transactionPublicKey, privateViewKey);
    }

    try {
        const key = await CryptoUtils().generateKeyDerivation(transactionPublicKey, privateViewKey);
        return key;
    } catch (err) {
        return nullKey;
    }
}

export async function generateKeyImagePrimitive(
    publicSpendKey: string,
    privateSpendKey: string,
    outputIndex: number,
    derivation: string): Promise<[string, string]> {

    if (Config.derivePublicKey && Config.deriveSecretKey && Config.generateKeyImage) {
        /* Derive the transfer public key from the derived key, the output index, and our public spend key */
        const publicEphemeral = await Config.derivePublicKey(
            derivation, outputIndex, publicSpendKey,
        );

        /* Derive the key image private key from the derived key, the output index, and our spend secret key */
        const privateEphemeral = await Config.deriveSecretKey(
            derivation, outputIndex, privateSpendKey,
        );

        /* Generate the key image */
        const keyImage = await Config.generateKeyImage(publicEphemeral, privateEphemeral);

        return [keyImage, privateEphemeral];
    }

    try {
        const keys = await CryptoUtils().generateKeyImagePrimitive(
            publicSpendKey, privateSpendKey, outputIndex, derivation,
        );

        return keys;
    } catch (err) {
        return [nullKey, nullKey];
    }
}

export async function generateKeyImage(
    transactionPublicKey: string,
    privateViewKey: string,
    publicSpendKey: string,
    privateSpendKey: string,
    transactionIndex: number): Promise<[string, string]> {

    const derivation: string = await generateKeyDerivation(transactionPublicKey, privateViewKey);

    return generateKeyImagePrimitive(
        publicSpendKey, privateSpendKey, transactionIndex, derivation,
    );
}

export async function underivePublicKey(
    derivation: string,
    outputIndex: number,
    outputKey: string): Promise<string> {
    if (Config.underivePublicKey) {
        return Config.underivePublicKey(derivation, outputIndex, outputKey);
    }

    try {
        const key = await CryptoUtils().underivePublicKey(
            derivation, outputIndex, outputKey,
        );

        return key;
    } catch (err) {
        return nullKey;
    }
}
