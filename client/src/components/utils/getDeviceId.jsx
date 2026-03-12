import FingerprintJs from '@fingerprintjs/fingerprintjs';

export const getDeviceId = async () => {
    const fp = await FingerprintJs.load();
    const result = await fp.get();
    return result.visitorId;
};