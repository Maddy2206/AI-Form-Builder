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
            const firstBraceIndex = form.jsonform.indexOf("{");
            const lastBraceIndex = form.jsonform.lastIndexOf("}");
            const jsonString = form.jsonform.substring(
              firstBraceIndex,
              lastBraceIndex + 1
            );
            return (
              <FormListItemResp
                key={index}
                jsonForm={JSON.parse(jsonString)}
                formRecord={form}
              />
            );
          })
        ) : (
          <p>No forms found</p>
        )}
      </div>
    </div>
  );
}

export default Responses;
