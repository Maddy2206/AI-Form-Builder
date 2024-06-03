"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/configs';
import { eq } from 'drizzle-orm';
import { userResponses } from '@/configs/schema';
import { ArrowDown, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

function FormListItemResp({ jsonForm, formRecord }) {
  let jsonData = [];

  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    fetchResponseCount();
  }, []);

  const fetchResponseCount = async () => {
    const countResult = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.formRef, formRecord.id))
      .execute();
    setResponseCount(countResult.length);
  };

  const ExportData = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.formRef, formRecord.id))
      .execute();
    console.log(result);
    if (result) {
      result.forEach((item) => {
        const jsonItem = JSON.parse(item.jsonResponse);
        jsonData.push(jsonItem);
      });
      setLoading(false);
    }
    console.log(jsonData);
    exportToExcel(jsonData);
  };

  const exportToExcel = (jsonData) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, jsonForm?.formTitle + ".xlsx");
  };

  return (
    <div className="border shadow-sm rounded-lg p-4 my-5">
      <h2 className="text-lg">{jsonForm?.formTitle}</h2>
      <h2 className="text-sm text-gray-500">{jsonForm?.formSubheading}</h2>
      <hr className="my-4"></hr>
      <div className="flex justify-between">
        <h2 className='text- font-bold'>{responseCount} responses</h2>
        <Button
          className="rounded-lg"
          size="sm"
          onClick={ExportData}
          disabled={loading}
        >
         {loading ? <Loader2 className='animate-spin' /> : null}
      <span className="flex"> <ArrowDown />Download</span>
        </Button>
      </div>
    </div>
  );
}

export default FormListItemResp;
