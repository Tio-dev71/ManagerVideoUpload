const { TOTP } = require('totp-generator');
const secret = 'JBSWY3DPEHPK3PXP'; // example secret
const token = TOTP.generate(secret);
console.log('Token type:', typeof token);
console.log('Token value:', token);
