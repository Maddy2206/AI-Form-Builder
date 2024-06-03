import React from 'react';
import { JsonForms, userResponses } from '@/configs/schema';
import { Edit, Share2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { db } from '@/configs';
import { toast } from 'sonner';
import { RWebShare } from 'react-web-share';


function FormListItem({ jsonForm, formRecord, refreshData }) {
  const { user } = useUser();

  const onDeleteForm = async () => {
    try {
      // Delete related records from userResponses table first
      await db.delete(userResponses).where(eq(userResponses.formRef,formRecord.id)).execute();
  
      // Delete the record from JsonForms table
      await db.delete(JsonForms).where(eq(JsonForms.id,formRecord.id)).execute();
  
      toast('Form Deleted');
      refreshData();
    } catch (error) {
      console.error('Error deleting form:', error);
      toast('Error deleting form. Please try again later.', { type: 'error' });
    }
  };

  return (
    <div className="border shadow-sm rounded-lg p-4">
      <div className="flex justify-between">
        <h2></h2>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash className="h-5 w-5 text-red-600 cursor-pointer"  />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete your form</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteForm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <h2 className="text-lg">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-500">{jsonForm?.formSubheading}</h2>
      <hr className="my-4"></hr>
      <div className="flex justify-between">
        <RWebShare
          data={{
            text: jsonForm?.formSubheading + ', Build your forms in minutes using AI',
            url: process.env.NEXT_PUBLIC_BASE_URL + '/aiform/' + formRecord?.id,
            title: jsonForm?.formTitle,
          }}
          onClick={() => console.log('shared successfully!')}
        >
          <Button variant="outline" size="sm" className="flex gap-2">
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </RWebShare>

        <Link href={'/edit-form/' + formRecord?.id}>
          <Button className="flex gap-2" size="sm">
            <Edit className="h-5 w-5" />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default FormListItem;
