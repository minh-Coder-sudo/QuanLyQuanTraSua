const PayOS = require('@payos/node');

const payos = new PayOS(
    '0b32d316-2068-4547-8c63-f3a16f511bfb',
    'd36f81b5-c977-471f-aef9-22cc070cac1b',
    '4b4845dff202314c0ec269a0dc2a0f8a56598b6231b21e1652033602b57ebb1d'
);

module.exports = payos;
