import base64
from dataclasses import dataclass

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, NoEncryption, PrivateFormat, PublicFormat
from django.core.management.utils import get_random_secret_key


@dataclass
class KeyPair:
    signing_key: str
    public: str


def generate_key_pair() -> KeyPair:
    private_key = Ed25519PrivateKey.generate()

    signing_key = base64.b64encode(
        private_key.private_bytes(Encoding.Raw, PrivateFormat.Raw, NoEncryption())
    ).decode()

    public_key = base64.b64encode(
        private_key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
    ).decode()

    return KeyPair(signing_key=signing_key, public=public_key)


def generate_account():
    key_pair = generate_key_pair()
    print(f'Signing Key: {key_pair.signing_key}')
    print(f'Account Number: {key_pair.public}')


def generate_secret_key():
    secret_key = get_random_secret_key()
    print(f'SECRET_KEY: {secret_key}')


if __name__ == '__main__':
    print()
    generate_account()
    generate_secret_key()
