"use client";

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/configs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { AiChatSession } from '@/configs/AiModel';
import { useUser } from '@clerk/nextjs';
import { JsonForms } from '@/configs/schema';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const PROMPT = ",On the basis of the description  give a form in JSON format   with formTitle, formSubheading, and with formFields having fieldName, fieldTitle, fieldType, placeholder, label, ,required Fields in JSON format.Just only give the JSON formatted file in proper format nad nothing else.";

function CreateForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const route = useRouter();

  const onCreateForm = async () => {
    setLoading(true);
    const result = await AiChatSession.sendMessage("Description: " + userInput + PROMPT);
    if (result.response.text()) {
      const resp = await db.insert(JsonForms).values({
        jsonform: result.response.text(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD/MM/YYYY')
      }).returning({id:JsonForms.id});
      if (resp[0].id) {
        route.push('/edit-form/' + resp[0].id);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button className='bg-primary' onClick={() => setOpenDialog(true)}>+ Create form</Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea className="my-3" onChange={(event) => setUserInput(event.target.value)} placeholder="Give a description about your form">
              </Textarea>
              <div className='flex gap-3 my-3 justify-end'>
                <Button variant="destructive" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button disabled={loading} onClick={onCreateForm}>
                  {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
