import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firestore
// On GCP (Cloud Run, App Engine, etc.): Uses Application Default Credentials automatically
// On local dev: Uses gcloud auth application-default login credentials
export const db = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  // No credentials needed - uses ADC automatically
});

// Test the connection
db.listCollections()
  .then(() => {
    console.log('Firestore connected successfully');
  })
  .catch((error: any) => {
    console.error('Firestore connection error:', error);
  });