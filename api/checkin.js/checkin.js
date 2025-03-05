const { google } = require('googleapis');

// Google Sheets API credentials (Replace with your credentials)
const credentials = {
  type: 'service_account',
  project_id: 'your-project-id',
  private_key_id: 'your-private-key-id',
  private_key: 'your-private-key',
  client_email: 'your-service-account-email',
  client_id: 'your-client-id',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'your-certificate-url',
};

const sheets = google.sheets('v4');

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth.getClient();
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { name, flightNumber } = req.query;

    if (!name || !flightNumber) {
      return res.status(400).json({ error: 'Missing name or flight number' });
    }

    try {
      const authClient = await authenticate();
      const sheetId = 'your-google-sheet-id';
      const range = 'Sheet1!A:B'; // Adjust range as per your data structure

      const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId: sheetId,
        range: range,
      });

      const rows = response.data.values;
      let isCheckedIn = false;

      if (rows) {
        rows.forEach(row => {
          if (row[0].toLowerCase() === name.toLowerCase() && row[1].toLowerCase() === flightNumber.toLowerCase()) {
            isCheckedIn = true;
          }
        });
      }

      if (isCheckedIn) {
        return res.json({ status: 'success', message: 'You are on the flight.' });
      } else {
        return res.json({ status: 'error', message: 'You are not on the flight.' });
      }

    } catch (err) {
      console.error('Error accessing Google Sheets API:', err);
      return res.status(500).json({ error: 'Error checking flight data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
