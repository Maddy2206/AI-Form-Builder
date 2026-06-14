'use client';

import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '@/configs';
import FormListItem from './FormListItem';
import { FileText } from 'lucide-react';
import CreateForm from './CreateForm';

function FormList() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) GetFormList();
  }, [user]);

  const GetFormList = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(JsonForms.id))
      .execute();
    setFormList(result);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (formList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="font-display font-semibold text-gray-900 mb-1">No forms yet</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Create your first form and start collecting responses.
        </p>
        <CreateForm />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {formList.map((form) => {
        const first = form.jsonform.indexOf('{');
        const last = form.jsonform.lastIndexOf('}');
        try {
          const parsed = JSON.parse(form.jsonform.substring(first, last + 1));
          return (
            <FormListItem
              key={form.id}
              jsonForm={parsed}
              formRecord={form}
              refreshData={GetFormList}
            />
          );
        } catch {
          return null;
        }
      })}
    </div>
  );
}

export default FormList;
