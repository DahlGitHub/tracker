import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteObject, getStorage, ref as r } from 'firebase/storage';
import React from 'react';

interface DeleteRowProps {
  docId: string;
  collectionName: string;
  message: string;
  imageUrl?: string;
}

const DeleteCollection = React.forwardRef<HTMLDivElement, DeleteRowProps>(
  ({ collectionName, docId, message, imageUrl }, ref) => {
    DeleteCollection.displayName = 'DeleteCollection';
    const [isOpen, setIsOpen] = useState(false);

    const deleteRow = async () => {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);

      if (imageUrl) {
        const storage = getStorage();
        const imageRef = r(storage, imageUrl);
        await deleteObject(imageRef);
      }
    };

    const handleConfirm = () => {
      deleteRow();
    };

    return (
      <Dialog>
        <Button
          asChild
          variant="ghost"
          className="h-8 w-full px-2 hover:bg-red-500 hover:text-gray-50"
        >
          <DialogTrigger onClick={() => setIsOpen(true)}>
            <Trash2 size={16} className="mr-2" />
            <div className="text-start w-full">Delete</div>
          </DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
            <DialogDescription className="pt-2 text-red-700">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-4">
            <DialogTrigger onClick={handleConfirm}>Confirm</DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

export default DeleteCollection;
