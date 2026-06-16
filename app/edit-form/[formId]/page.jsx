"use client";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FormUi from "../_components/FormUi";
import Controller from "../_components/Controller";
import {
  ArrowLeft, Copy, Share2, SquareArrowOutUpRight, Palette,
  Wrench,
} from "lucide-react";
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
  const [showPreview, setShowPreview] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);

  // Panel sizing
  const [editorPercent, setEditorPercent] = useState(50);
  const [toolbarWidth, setToolbarWidth] = useState(288);
  const bodyRef = useRef(null);

  const router = useRouter();

  // ── Resize handlers ───────────────────────────────────────────────────────
  const startEditorPreviewDrag = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startPercent = editorPercent;
    const bodyWidth = bodyRef.current?.offsetWidth || 1000;
    const availableWidth = bodyWidth - (showToolbar ? toolbarWidth : 0);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev) => {
      const deltaPercent = ((ev.clientX - startX) / availableWidth) * 100;
      setEditorPercent(Math.min(80, Math.max(20, startPercent + deltaPercent)));
    };
    const onUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [editorPercent, showToolbar, toolbarWidth]);

  const startToolbarDrag = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = toolbarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev) => {
      const delta = ev.clientX - startX;
      setToolbarWidth(Math.min(480, Math.max(200, startWidth - delta)));
    };
    const onUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [toolbarWidth]);

  // ── Field management ──────────────────────────────────────────────────────
  const onAddField = (fieldType) => {
    const newField = generateDefaultField(fieldType);
    const updated = { ...jsonForm, formFields: [...(jsonForm.formFields || []), newField] };
    setJsonForm(updated);
    setUpdateTrigger(Date.now());
  };

  const onReorder = (newFields) => {
    const updated = { ...jsonForm, formFields: newFields };
    setJsonForm(updated);
    setUpdateTrigger(Date.now());
  };

  const onFontChange = (fontKey, value) => {
    const updated = { ...jsonForm, [fontKey]: value };
    setJsonForm(updated);
    setUpdateTrigger(Date.now());
  };

  const onFormBgChange = (value) => {
    const updated = { ...jsonForm, formBackground: value };
    setJsonForm(updated);
    setUpdateTrigger(Date.now());
  };

  useEffect(() => {
    if (user) GetFormData();
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
      const jsonString = result[0].jsonform;
      const first = jsonString.indexOf("{");
      const last = jsonString.lastIndexOf("}");
      const parsed = JSON.parse(jsonString.substring(first, last + 1));
      setJsonForm(parsed);
      setRecord(result[0]);
      setSelectedBackground(result[0].background || "");
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  const updateDatabase = async () => {
    try {
      await db
        .update(JsonForms)
        .set({ jsonform: JSON.stringify(jsonForm) })
        .where(
          and(
            eq(JsonForms.id, record.id),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        )
        .execute();
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  const onFieldUpdate = (value, index) => {
    const updated = { ...jsonForm };
    updated.formFields[index] = {
      ...updated.formFields[index],
      ...value,
    };
    setJsonForm(updated);
    setUpdateTrigger(Date.now());
  };

  const deleteField = (indexToRemove) => {
    if (!Array.isArray(jsonForm.formFields)) return;
    setJsonForm({
      ...jsonForm,
      formFields: jsonForm.formFields.filter((_, i) => i !== indexToRemove),
    });
    setUpdateTrigger(Date.now());
  };

  const updateControllerFields = async (value, columnName) => {
    await db
      .update(JsonForms)
      .set({ [columnName]: value })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      )
      .execute();
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Center: view toggles (Overleaf-style) */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              !showPreview
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              showPreview
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Split Preview
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Link href={'/aiform/' + record?.id} target="_blank">
            <Button size="sm" variant="outline" className="flex gap-2 h-8 text-xs">
              <SquareArrowOutUpRight className="h-3.5 w-3.5" />
              Open
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

          {!showToolbar && (
            <Button
              size="sm"
              variant="outline"
              className="flex gap-2 h-8 text-xs"
              onClick={() => setShowToolbar(true)}
            >
              <Wrench className="h-3.5 w-3.5" />
              ToolBar
            </Button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div ref={bodyRef} className="flex flex-1 overflow-hidden">

        {/* Editor panel */}
        <div
          className="flex flex-col min-w-0 overflow-hidden"
          style={showPreview ? { width: `${editorPercent}%`, flexShrink: 0 } : { flex: 1 }}
        >
          <PanelLabel dotColor="bg-blue-400" label="Editor" />
          <div
              className="flex-1 overflow-auto p-6"
              style={{
                backgroundImage: selectedBackground || undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: selectedBackground ? undefined : '#f9fafb',
              }}
            >
            <FormUi
              jsonForm={jsonForm}
              onFieldUpdate={onFieldUpdate}
              deleteField={deleteField}
              selectedTheme={selectedTheme}
              editable={true}
              onReorder={onReorder}
              wide={true}
              formBackground={jsonForm?.formBackground}
            />
          </div>
        </div>

        {/* Editor ↔ Preview divider */}
        {showPreview && (
          <ResizeDivider onPointerDown={startEditorPreviewDrag} />
        )}

        {/* Live preview panel */}
        {showPreview && (
          <div className="flex flex-col min-w-0 overflow-hidden" style={{ flex: 1 }}>
            <PanelLabel dot="pulse" dotColor="bg-green-400" label="Live Preview" />
            <div
              className="flex-1 overflow-auto flex items-start justify-center p-8 bg-white"
              style={{
                backgroundImage: selectedBackground || undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <FormUi
                jsonForm={jsonForm}
                selectedTheme={selectedTheme}
                editable={false}
                formId={0}
                formBackground={jsonForm?.formBackground}
              />
            </div>
          </div>
        )}

        {/* Preview ↔ Toolbar divider (split mode) / Editor ↔ Toolbar divider (editor-only mode) */}
        {showToolbar && (
          <ResizeDivider onPointerDown={startToolbarDrag} />
        )}

        {/* Right design toolbar */}
        {showToolbar && (
          <aside
            className="flex flex-col bg-white overflow-hidden flex-shrink-0"
            style={{ width: `${toolbarWidth}px` }}
          >
            <Controller
              onClose={() => setShowToolbar(false)}
              onAddField={onAddField}
              onFontChange={onFontChange}
              currentFonts={{
                heading: jsonForm?.formHeadingFont,
                body: jsonForm?.formBodyFont,
              }}
              onFormBgChange={onFormBgChange}
              currentFormBg={jsonForm?.formBackground}
              selectedTheme={(value) => {
                updateControllerFields(value, 'theme');
                setSelectedTheme(value);
              }}
              selectedBackground={(value) => {
                setSelectedBackground(value);
                updateControllerFields(value, 'background');
              }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function generateDefaultField(type) {
  const id = `field_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const base = { fieldName: id, required: false };
  const templates = {
    text:     { ...base, fieldType: 'text',     label: 'Short Answer',  placeholder: 'Your answer…' },
    textarea: { ...base, fieldType: 'textarea', label: 'Long Answer',   placeholder: 'Enter your response…' },
    select:   { ...base, fieldType: 'select',   label: 'Dropdown',      placeholder: 'Select an option', options: [{ label: 'Option 1' }, { label: 'Option 2' }] },
    radio:    { ...base, fieldType: 'radio',    label: 'Single Choice', options: [{ label: 'Option A' }, { label: 'Option B' }] },
    checkbox: { ...base, fieldType: 'checkbox', label: 'Multiple Choice', options: [{ label: 'Choice 1' }, { label: 'Choice 2' }] },
    date:     { ...base, fieldType: 'date',     label: 'Date' },
    rating:   { ...base, fieldType: 'rating',   label: 'Rating',        maxRating: 5 },
  };
  return templates[type] || templates.text;
}

function PanelLabel({ dot, dotColor = 'bg-blue-400', label }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
      <span className={`w-2 h-2 rounded-full inline-block ${dotColor} ${dot === 'pulse' ? 'animate-pulse' : ''}`} />
      <span className="text-xs text-gray-400 font-medium">{label}</span>
    </div>
  );
}

function ResizeDivider({ onPointerDown }) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="flex-shrink-0 group relative cursor-col-resize select-none z-10"
      style={{ width: '8px' }}
    >
      {/* Invisible hit area with visible line in center */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200 group-hover:bg-blue-400 group-active:bg-blue-500 transition-colors" />
      {/* Drag handle dots */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-[3px] items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[3px] h-[3px] rounded-full bg-blue-400" />
        ))}
      </div>
    </div>
  );
}

export default EditForm;
