"use client";
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { db } from '@/configs';
import FormListItem from './FormListItem';
import { desc } from 'drizzle-orm';

function FormList() {
    const { user } = useUser();
    const [formList, setFormList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFormList();
        }
    }, [user]);

    const GetFormList = async () => {
        const result = await db
            .select()
            .from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(JsonForms.id))
            .execute();
        setFormList(result);
        console.log(result);
    };

    return (
        <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
            {formList.map((form, index) => {
                // Find the indices of the first '{' and last '}' characters
                const firstBraceIndex = form.jsonform.indexOf('{');
                const lastBraceIndex = form.jsonform.lastIndexOf('}');

                // Extract the JSON string between the first '{' and last '}' characters
                const jsonString = form.jsonform.substring(firstBraceIndex, lastBraceIndex + 1);

                // Log the JSON string for debugging
                console.log("JSON String:", jsonString);

                try {
                    // Parse the JSON string and pass it to the FormListItem component
                    const parsedJson = JSON.parse(jsonString);
                    return (
                        <FormListItem
                            key={index}
                            jsonForm={parsedJson}
                            formRecord={form}
                            refreshData={GetFormList}
                        />
                    );
                } catch (error) {
                    console.error("Failed to parse JSON string:", error);
                    return null; // Skip rendering this item
                }
            })}
        </div>
    );
}

export default FormList;
