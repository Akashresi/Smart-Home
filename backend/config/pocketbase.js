const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
module.exports = pb;
