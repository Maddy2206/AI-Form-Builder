'use client';

import React, { useState } from 'react';
import { JsonForms, userResponses } from '@/configs/schema';
import { Edit, Share2, Trash, Copy, FileText, Check, X, Clock } from 'lucide-react';
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
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(formRecord?.formName || jsonForm?.formTitle || '');
  const [savingName, setSavingName] = useState(false);

  const displayName = formRecord?.formName || jsonForm?.formTitle || 'Untitled Form';
  const displayDesc = formRecord?.formDescription || jsonForm?.formSubheading || 'No description';

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
    } catch {
      toast('Error deleting form. Please try again.');
    }
  };

  const onSaveName = async () => {
    if (!nameValue.trim()) return;
    setSavingName(true);
    await db.update(JsonForms).set({ formName: nameValue.trim() }).where(eq(JsonForms.id, formRecord.id));
    setSavingName(false);
    setEditing(false);
    toast('Form name updated');
    refreshData();
  };

  const onCancelEdit = () => {
    setNameValue(displayName);
    setEditing(false);
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
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <Trash className="w-3.5 h-3.5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this form?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{displayName}</strong> and all its responses. This cannot be undone.
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

      {/* Title — inline editable */}
      {editing ? (
        <div className="flex items-center gap-1.5 mb-1">
          <input
            className="flex-1 text-sm font-semibold text-gray-900 border-b border-blue-400 outline-none bg-transparent pb-0.5"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveName();
              if (e.key === 'Escape') onCancelEdit();
            }}
            autoFocus
          />
          <button
            onClick={onSaveName}
            disabled={savingName}
            className="w-6 h-6 rounded flex items-center justify-center text-green-600 hover:bg-green-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCancelEdit}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mb-1 group/title">
          <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {displayName}
          </h3>
          <button
            onClick={() => setEditing(true)}
            className="w-5 h-5 rounded flex items-center justify-center text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
          >
            <Edit className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
        {displayDesc}
      </p>

      {/* Created at */}
      {formRecord?.createdAt && (
        <div className="flex items-center gap-1 mb-4">
          <Clock className="w-3 h-3 text-gray-300" />
          <span className="text-[11px] text-gray-300">{formRecord.createdAt}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <RWebShare
          data={{
            text: displayDesc + ', Build your forms in minutes with INTELLIFORM',
            url: window.location.origin + '/aiform/' + formRecord?.id,
            title: displayName,
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
