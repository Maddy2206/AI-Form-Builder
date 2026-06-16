'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/configs';
import { eq } from 'drizzle-orm';
import { userResponses } from '@/configs/schema';
import { BarChart2, Download, Loader2, MessageSquare } from 'lucide-react';
import * as XLSX from 'xlsx';
import Link from 'next/link';

function FormListItemResp({ jsonForm, formRecord }) {
  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    fetchResponseCount();
  }, []);

  const fetchResponseCount = async () => {
    const result = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.formRef, formRecord.id))
      .execute();
    setResponseCount(result.length);
  };

  const exportData = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.formRef, formRecord.id))
      .execute();
    const jsonData = result.map((item) => JSON.parse(item.jsonResponse));
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
    XLSX.writeFile(workbook, (formRecord?.formName || jsonForm?.formTitle || 'responses') + '.xlsx');
    setLoading(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200">

      {/* Top: icon + count */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-violet-600" />
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          responseCount > 0
            ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-gray-50 text-gray-500 border border-gray-100'
        }`}>
          {responseCount} {responseCount === 1 ? 'response' : 'responses'}
        </span>
      </div>

      {/* Title & description */}
      <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
        {formRecord?.formName || jsonForm?.formTitle || 'Untitled Form'}
      </h3>
      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-5">
        {formRecord?.formDescription || jsonForm?.formSubheading || 'No description'}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Link href={`/dashboard/analytics/${formRecord.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all">
            <BarChart2 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </Link>
        <button
          onClick={exportData}
          disabled={loading || responseCount === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-white hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Export
        </button>
      </div>
    </div>
  );
}

export default FormListItemResp;
