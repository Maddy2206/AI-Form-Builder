'use client';

import React from 'react';
import { JsonForms, userResponses } from '@/configs/schema';
import { Edit, Share2, Trash, Copy, FileText } from 'lucide-react';
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
import { eq } from 'drizzle-orm';
import { db } from '@/configs';
import { toast } from 'sonner';
import { RWebShare } from 'react-web-share';

function FormListItem({ jsonForm, formRecord, refreshData }) {
  const { user } = useUser();

  const copyLink = () => {
    const url = `${window.location.origin}/aiform/${formRecord?.id}`;
    navigator.clipboard.writeText(url).then(() => toast('Link copied!'));
  };

  const onDeleteForm = async () => {
    try {
      await db.delete(userResponses).where(eq(userResponses.formRef, formRecord.id)).execute();
      await db.delete(JsonForms).where(eq(JsonForms.id, formRecord.id)).execute();
      toast('Form deleted');
      refreshData();
    } catch (error) {
      toast('Error deleting form. Please try again.');
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">

      {/* Top: icon + delete */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50">
              <Trash className="w-3.5 h-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this form?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{jsonForm?.formTitle}</strong> and all its responses. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteForm} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Title & description */}
      <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
        {jsonForm?.formTitle || 'Untitled Form'}
      </h3>
      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-5">
        {jsonForm?.formSubheading || 'No description'}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <RWebShare
          data={{
            text: jsonForm?.formSubheading + ', Build your forms in minutes with INTELLIFORM',
            url: window.location.origin + '/aiform/' + formRecord?.id,
            title: jsonForm?.formTitle,
          }}
        >
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-all">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </RWebShare>

        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-300 hover:text-gray-800 transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>

        <Link href={'/edit-form/' + formRecord?.id} className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-white hover:bg-gray-700 transition-colors">
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
}

export default FormListItem;
