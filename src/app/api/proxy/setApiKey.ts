// pages/api/setApiKey.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const { apiKey } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const userDocRef = doc(db, 'users', userId as string);
    await setDoc(userDocRef, { apiKey }, { merge: true });
    return res.status(200).json({ message: 'API key set successfully' });
  } catch (error) {
    console.error('Error setting API key:', error);
    return res.status(500).json({ error: 'Failed to set API key' });
  }
}
