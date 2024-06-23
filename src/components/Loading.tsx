import { Loader2 } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl font-bold"><Loader2 className='animate-spin' size={32} /></p>
    </div>
  );
};

export default Loading;