"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import Controller from "../_components/Controller";
import { ArrowLeft, Copy, Share2, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";


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
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <Link href={'/aiform/' + record?.id} target="_blank">
            <Button size="sm" variant="outline" className="flex gap-2 h-8 text-xs">
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
              Preview
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="flex gap-2 h-8 text-xs"
            onClick={() => {
              const url = `${window.location.origin}/aiform/${record?.id}`;
              navigator.clipboard.writeText(url).then(() => toast('Link copied!'));
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Link
          </Button>
          <RWebShare
            data={{
              text: jsonForm?.formSubheading + ', Build your forms in minutes with INTELLIFORM',
              url: window.location.origin + '/aiform/' + record?.id,
              title: jsonForm?.formTitle,
            }}
          >
            <Button size="sm" variant="outline" className="flex gap-2 h-8 text-xs">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </RWebShare>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <Controller
              selectedTheme={(value) => {
                updateControllerFields(value, 'theme');
                setSelectedTheme(value);
              }}
              selectedBackground={(value) => {
                setSelectedBackground(value);
                updateControllerFields(value, 'background');
              }}
            />
          </div>
          <div
            className="md:col-span-2 border border-gray-200 rounded-2xl p-4 flex items-center justify-center min-h-[500px] bg-white shadow-sm"
            style={{ backgroundImage: selectedBackground, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
    </div>
  );
}

export default EditForm;
