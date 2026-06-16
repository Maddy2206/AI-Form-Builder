"use client";

import moment from 'moment';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/configs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { AiChatSession } from '@/configs/AiModel';
import { useUser } from '@clerk/nextjs';
import { JsonForms } from '@/configs/schema';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const PROMPT = `, On the basis of the description give a form in JSON format with formTitle, formSubheading, and formFields array. Each field must have: fieldName (camelCase, no spaces), fieldTitle, fieldType, placeholder, label, required (boolean). Supported fieldTypes: text, textarea, email, phone, number, url, date, time, select, radio, checkbox, rating, scale. Rules: For select/radio/checkbox always include options array (each option has a label string). For rating include maxRating: 5. For scale include min: 1, max: 10, minLabel, maxLabel. Use textarea for long-answer questions. Use rating or scale for satisfaction/rating questions. Use url for LinkedIn, GitHub, portfolio fields. Return ONLY valid JSON, no markdown, no explanation.`;

function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  const onClose = () => {
    setOpenDialog(false);
    setFormName('');
    setFormDescription('');
  };

  const onCreateForm = async () => {
    if (!formName.trim() || !formDescription.trim()) return;
    setLoading(true);
    const result = await AiChatSession.sendMessage("Description: " + formDescription + PROMPT);
    if (result.response.text()) {
      const resp = await db.insert(JsonForms).values({
        jsonform: result.response.text(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD/MM/YYYY HH:mm'),
        formName: formName.trim(),
        formDescription: formDescription.trim(),
      }).returning({ id: JsonForms.id });
      if (resp[0].id) {
        route.push('/edit-form/' + resp[0].id);
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <Button className='bg-primary' onClick={() => setOpenDialog(true)}>+ Create form</Button>
      <Dialog open={openDialog} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-1">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Form Name</label>
              <Input
                placeholder="e.g. Customer Feedback Survey"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <Textarea
                placeholder="Describe what your form should collect..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button disabled={loading || !formName.trim() || !formDescription.trim()} onClick={onCreateForm}>
                {loading ? <Loader2 className='animate-spin' /> : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
