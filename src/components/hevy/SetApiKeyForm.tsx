// SetApiKeyForm.tsx

import React, { useState } from 'react';

import { doc, setDoc } from 'firebase/firestore';
import { useSession } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { db } from '../../../firebase';

const SetApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const { session } = useSession();

  const handleSaveApiKey = async () => {
    if (!session) return;

    try {
      const userDoc = doc(db, 'users', session.user.id);
      await setDoc(userDoc, { apiKey }, { merge: true });
      alert('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      alert('Failed to save API key');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set API Key</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <Input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSaveApiKey} className="mt-2">Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SetApiKeyForm;
