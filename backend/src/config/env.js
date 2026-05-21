const path = require('path');
const dotenv = require('dotenv');

const rootEnv = path.resolve(__dirname, '../../../.env');
const localEnv = path.resolve(__dirname, '../../.env');

dotenv.config({ path: rootEnv });
dotenv.config({ path: localEnv });

function isPlaceholderEnv() {
  const url = process.env.SUPABASE_URL || '';
  return (
    !url
    || url.includes('placeholder')
    || url.includes('your-project')
    || !process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your-service-role-key'
    || process.env.SUPABASE_SERVICE_ROLE_KEY === 'placeholder-key'
  );
}

module.exports = { isPlaceholderEnv };
