"use client"
import { JsonForms } from '@/configs/schema'
import React, { useEffect ,useState} from 'react'
import { db } from '@/configs'
import { eq } from 'drizzle-orm'
import FormUi from '@/app/edit-form/_components/FormUi'

function LiveAiForm({params}) {
    const [record,setRecord]=useState();
    const [jsonForm,setJsonForm]=useState([]);
    useEffect(()=>{
        params&&GetFormData()
    },[params])
    const GetFormData=async()=>{
        const result=await db.select().from(JsonForms).where(eq(JsonForms.id,Number(params?.formid))).execute();
        let jsonString = result[0].jsonform;
      const firstBraceIndex = jsonString.indexOf("{");
      const lastBraceIndex = jsonString.lastIndexOf("}");
      const jsonStringCleaned = jsonString.substring(
        firstBraceIndex,
        lastBraceIndex + 1
      );
      console.log(jsonStringCleaned);
      const parsedJson = JSON.parse(jsonStringCleaned);
      setJsonForm(parsedJson);
      setRecord(result[0]);
        console.log(result);
    }
  return (
    <div className='p-10 flex justify-center items-center min-h-screen' style={{backgroundImage: record?.background, backgroundSize: 'cover', backgroundPosition: 'center'}}>
  <div className='w-full max-w-3xl bg-white bg-opacity-75 p-8 rounded-lg shadow-md'>
    <FormUi
      jsonForm={jsonForm}
      onFieldUpdate={() => console.log}
      deleteField={() => console.log}
      selectedTheme={record?.theme}
      editable={false}
      formId={record?.id}
    />
  </div>
</div>

  
  )
}

export default LiveAiForm