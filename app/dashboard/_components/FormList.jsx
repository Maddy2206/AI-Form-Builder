"use client"
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import React, { useEffect ,useState} from 'react'
import { db } from '@/configs';
import FormListItem from './FormListItem';
import { desc } from 'drizzle-orm';

function FormList() {
    const {user} =useUser();
    const [formList,setFormList]=useState([]);

    useEffect(()=>{
         user&&GetFormList();
    },[user])
    const GetFormList=async()=>{
        const result=await db.select().from(JsonForms).where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress)).orderBy(desc(JsonForms.id)).execute();
        setFormList(result);
        console.log(result);
    }

    return (
        <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
          {formList.map((form, index) => {
            // Find the indices of the first '{' and last '}' characters
            const firstBraceIndex = form.jsonform.indexOf('{');
            const lastBraceIndex = form.jsonform.lastIndexOf('}');
      
            // Extract the JSON string between the first '{' and last '}' characters
            const jsonString = form.jsonform.substring(firstBraceIndex, lastBraceIndex + 1);
      
            // Parse the JSON string and pass it to the FormListItem component
            return <FormListItem 
            key={index} 
            jsonForm={JSON.parse(jsonString)} 
            formRecord={form}
            refreshData={GetFormList}
            />;
          })}
        </div>
      )
    }

export default FormList