'use client';
import { JsonForms } from '@/configs/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/configs';
import { eq } from 'drizzle-orm';
import FormUi from '@/app/edit-form/_components/FormUi';
import Image from 'next/image';
import Link from 'next/link';

function LiveAiForm({ params }) {
  const [record, setRecord] = useState();
  const [jsonForm, setJsonForm] = useState([]);

  useEffect(() => {
    params && GetFormData();
  }, [params]);

  const GetFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, Number(params?.formid)))
      .execute();

    if (!result[0]) return;

    let jsonString = result[0].jsonform;
    const firstBraceIndex = jsonString.indexOf('{');
    const lastBraceIndex = jsonString.lastIndexOf('}');
    const jsonStringCleaned = jsonString.substring(firstBraceIndex, lastBraceIndex + 1);
    const parsedJson = JSON.parse(jsonStringCleaned);
    setJsonForm(parsedJson);
    setRecord(result[0]);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: record?.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <FormUi
          jsonForm={jsonForm}
          onFieldUpdate={() => {}}
          deleteField={() => {}}
          selectedTheme={record?.theme}
          selectedStyle={record?.style ? JSON.parse(record.style) : undefined}
          editable={false}
          formId={record?.id}
          enabledSignIn={false}
          formBackground={jsonForm?.formBackground}
        />
      </div>

      <footer className="py-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <span>⚡</span>
          <span>Built with INTELLIFORM</span>
        </Link>
      </footer>
    </div>
  );
}

export default LiveAiForm;
