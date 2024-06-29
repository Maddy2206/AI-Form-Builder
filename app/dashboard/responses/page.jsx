"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import FormListItemResp from "./_components/FormListItemResp";

function Responses() {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    if (user) {
      getFormList();
    }
  }, [user]);

  const getFormList = async () => {
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .execute();
      setFormList(result);
    } catch (error) {
      console.error("Error fetching form list:", error);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl flex items-center justify-between">
        Responses
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {formList && formList.length > 0 ? (
          formList.map((form, index) => {
            // Find the indices of the first '{' and last '}' characters
            const firstBraceIndex = form.jsonform.indexOf("{");
            const lastBraceIndex = form.jsonform.lastIndexOf("}");

            // Extract the JSON string between the first '{' and last '}' characters
            const jsonString = form.jsonform.substring(firstBraceIndex, lastBraceIndex + 1);

            // Log the JSON string for debugging
            console.log("JSON String:", jsonString);

            try {
              // Parse the JSON string and pass it to the FormListItemResp component
              const parsedJson = JSON.parse(jsonString);
              return (
                <FormListItemResp
                  key={index}
                  jsonForm={parsedJson}
                  formRecord={form}
                />
              );
            } catch (error) {
              console.error("Failed to parse JSON string:", error);
              return null; // Skip rendering this item
            }
          })
        ) : (
          <p>No forms found</p>
        )}
      </div>
    </div>
  );
}

export default Responses;
