import React, { useState, useEffect } from 'react';
import { Edit, Trash } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
} from "@/components/ui/alert-dialog";

function FieldEdit({ defaultValue, onUpdate,deleteField }) {
  const [label, setLabel] = useState(defaultValue.label);
  const [placeholder, setPlaceholder] = useState(defaultValue.placeholder);

  useEffect(() => {
    setLabel(defaultValue.label);
    setPlaceholder(defaultValue.placeholder);
  }, [defaultValue]);

  return (
    <div className='flex items-center gap-4'>
      <Popover>
        <PopoverTrigger>
          <Edit className='h-5 w-5 text-gray-300 cursor-pointer' />
        </PopoverTrigger>
        <PopoverContent>
          <h2 className='text-lg font-bold mb-2'>Edit Fields</h2>
          <div className='mb-4'>
            <Label>Label Name</Label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <Label>Placeholder Name</Label>
            <Input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => onUpdate({
              label: label,
              placeholder: placeholder
            })}
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger>
          <Trash className='h-5 w-5 text-red-500 cursor-pointer' />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the field.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteField()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FieldEdit;
