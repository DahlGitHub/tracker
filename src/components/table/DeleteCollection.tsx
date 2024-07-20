import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import {
    collection,
    doc,
    getDocs,
    writeBatch,
    orderBy,
    query,
  } from 'firebase/firestore';
  import { useState } from 'react';
  import { db } from '../../../firebase';
  import { Button } from '@/components/ui/button';
  import { Trash2 } from 'lucide-react';
  
  interface DeleteCollectionProps {
    collectionName: string;
    imageUrl?: boolean;
  }
  
  const DeleteCollection = ({
    collectionName,
    imageUrl,
  }: DeleteCollectionProps) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const deleteCollection = async (collectionPath: string) => {
      const collectionRef = collection(db, collectionPath);
      const q = query(collectionRef, orderBy('__name__'));
      await deleteQueryBatch(db, q);
    };
  
    const deleteQueryBatch = async (db: any, q: any) => {
      const snapshot = await getDocs(q);
      const batchSize = snapshot.size;
      if (batchSize === 0) {
        return;
      }
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      process.nextTick(() => {
        deleteQueryBatch(db, q);
      });
    };
  
    const handleConfirm = () => {
      deleteCollection(collectionName);
      setIsOpen(false);
    };
  
    return (
      <div>
        <Dialog>
          <Button asChild variant="outline" disabled className="h-8 px-2 hover:bg-red-500 hover:text-gray-50">
            <DialogTrigger onClick={() => setIsOpen(true)}>
              <Trash2 size={16} />
            </DialogTrigger>
          </Button>
          <DialogContent className="bg-red-500">
            <DialogHeader>
              <DialogTitle>Warning</DialogTitle>
              <DialogDescription>
                You are about to delete the data collection{' '}
                <span className="font-bold">{collectionName}</span>!
              </DialogDescription>
              <DialogDescription className="pt-2">
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between mt-4">
              <DialogTrigger onClick={() => setIsOpen(false)}>
                Cancel
              </DialogTrigger>
              <DialogTrigger onClick={handleConfirm}>Confirm</DialogTrigger>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  
  export default DeleteCollection;
  