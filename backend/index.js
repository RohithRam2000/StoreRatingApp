import app from '../server'; // Import the Express app
import serverless from 'serverless-http';

export default serverless(app);
