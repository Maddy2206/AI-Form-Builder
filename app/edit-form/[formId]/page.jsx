"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import Controller from "../_components/Controller";
import { ArrowLeft, Share, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RWebShare } from "react-web-share";


function EditForm({ params }) {
  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(null);
  const [record, setRecord] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedBackground, setSelectedBackground] = useState("");
  const router = useRouter(); 

  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user]);

  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm);
      updateDatabase();
    }
  }, [updateTrigger]);

  const GetFormData = async () => {
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(
          and(
            eq(JsonForms.id, params?.formId),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        )
        .execute();
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
      setSelectedBackground(result[0].background);
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  const updateDatabase = async () => {
    try {
      const result = await db
        .update(JsonForms)
        .set({ jsonform: JSON.stringify(jsonForm) })
        .where(
          and(
            eq(JsonForms.id, record.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        )
        .execute();
      console.log("Database updated successfully", result);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  const onFieldUpdate = (value, index) => {
    const updatedForm = { ...jsonForm };
    updatedForm.formFields[index] = {
      ...updatedForm.formFields[index],
      label: value.label,
      placeholder: value.placeholder,
    };
    setJsonForm(updatedForm);
    setUpdateTrigger(Date.now());
  };

  const deleteField = (indexToRemove) => {
    if (jsonForm.formFields && Array.isArray(jsonForm.formFields)) {
      const updatedFields = jsonForm.formFields.filter(
        (item, index) => index !== indexToRemove
      );
      setJsonForm({ ...jsonForm, formFields: updatedFields });
      setUpdateTrigger(Date.now());
    } else {
      console.error("jsonForm.fields is not defined or is not an array");
    }
  };

  const updateControllerFields = async (value, columnName) => {
    const result = await db
      .update(JsonForms)
      .set({
        [columnName]: value,
      })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      )
      .execute();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
      <h2 className="flex gap-2 items-center my-4 cursor-pointer hover:font-bold" onClick={() => router.back()}>
        <ArrowLeft /> Back
      </h2> 
      <div className="flex gap-2">
  <Link href={ '/aiform/'+
  record?.id } target="">
    <Button className='flex gap-2'><SquareArrowOutUpRight/>Preview</Button>
  </Link>
  <RWebShare
        data={{
          text: jsonForm?.formSubheading + ", Build your forms in minutes using AI",
          url: process.env.NEXT_PUBLIC_BASE_URL+"/aiform/"+record?.id,
          title: jsonForm?.formTitle,
        }}
        onClick={() => console.log("shared successfully!")}
      >
         <Button variant="outline" size="sm" className="flex gap-2">
          <Share2 className="h-5 w-5"></Share2>Share
        </Button>
      </RWebShare>
</div>

      </div>
       

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            selectedTheme={(value) => {
              updateControllerFields(value, "theme");
              setSelectedTheme(value);
            }}
            selectedBackground={(value) => {
              setSelectedBackground(value);
              updateControllerFields(value, "background");
            }}
          />
        </div>
        <div
          className="md:col-span-2 border rounded-lg p-3 flex items-center justify-center"
          style={{ backgroundImage: selectedBackground }}
        >
          <FormUi
            jsonForm={jsonForm}
            onFieldUpdate={onFieldUpdate}
            deleteField={(index) => deleteField(index)}
            selectedTheme={selectedTheme}
          />
        </div>
      </div>
    </div>
  );
}

export default EditForm;
