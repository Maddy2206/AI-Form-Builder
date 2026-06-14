'use client';

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import FormListItemResp from './_components/FormListItemResp';
import { MessageSquare } from 'lucide-react';

function Responses() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getFormList();
  }, [user]);

  const getFormList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .execute();
      setFormList(result);
    } catch (error) {
      console.error('Error fetching form list:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="font-display font-bold text-xl text-gray-900">Responses</h1>
        <p className="text-sm text-gray-500 mt-0.5">View analytics and export form responses</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : formList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="font-display font-semibold text-gray-900 mb-1">No forms yet</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Create a form from the dashboard to start collecting responses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formList.map((form) => {
            const first = form.jsonform.indexOf('{');
            const last = form.jsonform.lastIndexOf('}');
            try {
              const parsed = JSON.parse(form.jsonform.substring(first, last + 1));
              return (
                <FormListItemResp key={form.id} jsonForm={parsed} formRecord={form} />
              );
            } catch {
              return null;
            }
          })}
        </div>
      )}
    </div>
  );
}

export default Responses;
