'use client';

import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Phone, Link2, Star, Zap, GripVertical } from 'lucide-react';
import FieldEdit from './FieldEdit';
import { db } from '@/configs';
import { userResponses } from '@/configs/schema';
import moment from 'moment';
import { toast } from 'sonner';
import { SignInButton, useUser } from '@clerk/nextjs';
import { buildSmartDefaults, saveSmartValues } from '@/lib/smartFill';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function loadGoogleFont(fontName) {
  if (!fontName || fontName === 'inherit' || typeof document === 'undefined') return;
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

// ── Drag handle wrapper ──────────────────────────────────────────────────────
function SortableFieldItem({ id, editable, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: isDragging ? 'relative' : undefined,
        zIndex: isDragging ? 999 : undefined,
      }}
    >
      <div className="flex items-start gap-1">
        {editable && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-6 p-1 rounded cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0 select-none touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────
function StarRating({ fieldName, maxRating = 5, value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  const current = parseInt(value) || 0;
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          onClick={() => !disabled && onChange(fieldName, String(star))}
          className="focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || current)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      {current > 0 && (
        <span className="ml-2 text-sm text-gray-500 self-center">{current}/{maxRating}</span>
      )}
    </div>
  );
}

function LinearScale({ fieldName, min = 1, max = 10, minLabel, maxLabel, value, onChange, disabled }) {
  const current = parseInt(value) || min;
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{minLabel || min}</span>
        <span>{maxLabel || max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={current}
        disabled={disabled}
        onChange={(e) => onChange(fieldName, e.target.value)}
        className="w-full accent-primary"
      />
      <div className="flex justify-between mt-1">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <span
            key={n}
            className={`text-xs cursor-pointer select-none ${current === n ? 'text-primary font-bold' : 'text-gray-400'}`}
            onClick={() => !disabled && onChange(fieldName, String(n))}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function FieldWrapper({ children, isAutoFilled }) {
  return (
    <div className="my-3 w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-primary/30 transition-colors">
      {isAutoFilled && (
        <div className="flex items-center gap-1 mb-1">
          <Zap className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">Auto-filled</span>
        </div>
      )}
      {children}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function FormUi({
  jsonForm,
  selectedTheme,
  selectedStyle,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
  enabledSignIn = false,
  onReorder,
  wide = false,
  formBackground,
}) {
  const [formData, setFormData] = useState({});
  const [autoFilledFields, setAutoFilledFields] = useState({});
  const [submitted, setSubmitted] = useState(false);
  let formRef = useRef();
  const { user, isSignedIn } = useUser();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // Load Google Fonts when form fonts change
  useEffect(() => {
    loadGoogleFont(jsonForm?.formHeadingFont);
    loadGoogleFont(jsonForm?.formBodyFont);
  }, [jsonForm?.formHeadingFont, jsonForm?.formBodyFont]);

  // Smart-fill defaults (public fill mode only)
  useEffect(() => {
    if (!editable && jsonForm?.formFields) {
      const defaults = buildSmartDefaults(jsonForm.formFields);
      if (Object.keys(defaults).length > 0) {
        setFormData((prev) => ({ ...defaults, ...prev }));
        const flags = {};
        Object.keys(defaults).forEach((k) => (flags[k] = true));
        setAutoFilledFields(flags);
      }
    }
  }, [editable, jsonForm]);

  const markUserEdited = (fieldName) =>
    setAutoFilledFields((prev) => ({ ...prev, [fieldName]: false }));

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    markUserEdited(name);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    markUserEdited(name);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (fieldName, itemName, checked) => {
    const list = formData?.[fieldName] ? [...formData[fieldName]] : [];
    if (checked) list.push(itemName);
    else list.splice(list.indexOf(itemName), 1);
    markUserEdited(fieldName);
    setFormData((prev) => ({ ...prev, [fieldName]: list }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder) return;
    const fields = jsonForm?.formFields || [];
    const getId = (f, i) => f.fieldName || `field-${i}`;
    const oldIdx = fields.findIndex((f, i) => getId(f, i) === active.id);
    const newIdx = fields.findIndex((f, i) => getId(f, i) === over.id);
    if (oldIdx !== -1 && newIdx !== -1) {
      onReorder(arrayMove(fields, oldIdx, newIdx));
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await db.insert(userResponses).values({
        jsonResponse: JSON.stringify(formData),
        createdAt: moment().format('DD/MM/YYYY'),
        formRef: formId,
      });
      if (result) {
        if (!editable) saveSmartValues(formData, jsonForm?.formFields);
        setSubmitted(true);
        toast('Response submitted successfully!');
        formRef?.reset?.();
        setFormData({});
        setAutoFilledFields({});
      }
    } catch (err) {
      console.error(err);
      toast('Error saving response. Please try again.');
    }
  };

  if (submitted && !editable) {
    return (
      <div
        className="border rounded-2xl shadow-lg p-10 md:w-[600px] flex flex-col items-center justify-center gap-4 text-center"
        data-theme={selectedTheme}
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Thank you!</h2>
        <p className="text-gray-500">Your response has been recorded.</p>
        <button className="btn btn-primary mt-2" onClick={() => setSubmitted(false)}>
          Submit another response
        </button>
      </div>
    );
  }

  const getFieldId = (field, index) => field.fieldName || `field-${index}`;
  const headingFont = jsonForm?.formHeadingFont || 'inherit';
  const bodyFont = jsonForm?.formBodyFont || 'inherit';

  const renderField = (field, index) => {
    const fieldId = getFieldId(field, index);
    const isAutoFilled = !!autoFilledFields[field.fieldName];

    const editControls = editable && (
      <FieldEdit
        defaultValue={field}
        onUpdate={(v) => onFieldUpdate(v, index)}
        deleteField={() => deleteField(index)}
      />
    );

    let inner;

    if (field.fieldType === 'select') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <Select
            required={field?.required}
            value={formData[field.fieldName] || ''}
            onValueChange={(v) => handleSelectChange(field.fieldName, v)}
          >
            <SelectTrigger className="w-full bg-transparent">
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((item, i) => (
                <SelectItem key={i} value={item.label ?? item}>{item.label ?? item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrapper>
      );
    } else if (field.fieldType === 'radio') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <RadioGroup
            required={field?.required}
            value={formData[field.fieldName] || ''}
            onValueChange={(v) => handleSelectChange(field.fieldName, v)}
          >
            {field.options?.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={item.label ?? item} id={`${field.fieldName}-${i}`} />
                <Label htmlFor={`${field.fieldName}-${i}`}>{item.label ?? item}</Label>
              </div>
            ))}
          </RadioGroup>
        </FieldWrapper>
      );
    } else if (field.fieldType === 'checkbox') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {field?.options ? (
            field.options.map((item, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <Checkbox
                  id={`${field.fieldName}-${i}`}
                  checked={!!(formData[field.fieldName] || []).includes(item.label ?? item)}
                  onCheckedChange={(v) => handleCheckboxChange(field.fieldName, item.label ?? item, v)}
                />
                <Label htmlFor={`${field.fieldName}-${i}`}>{item.label ?? item}</Label>
              </div>
            ))
          ) : (
            <div className="flex gap-2 items-center">
              <Checkbox required={field.required} />
              <Label>{field.label}</Label>
            </div>
          )}
        </FieldWrapper>
      );
    } else if (field.fieldType === 'textarea') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <textarea
            name={field.fieldName}
            placeholder={field.placeholder}
            required={field?.required}
            value={formData[field.fieldName] || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
        </FieldWrapper>
      );
    } else if (field.fieldType === 'rating') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <StarRating
            fieldName={field.fieldName}
            maxRating={field.maxRating || 5}
            value={formData[field.fieldName]}
            onChange={handleSelectChange}
            disabled={editable}
          />
        </FieldWrapper>
      );
    } else if (field.fieldType === 'scale') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <LinearScale
            fieldName={field.fieldName}
            min={field.min || 1}
            max={field.max || 10}
            minLabel={field.minLabel}
            maxLabel={field.maxLabel}
            value={formData[field.fieldName]}
            onChange={handleSelectChange}
            disabled={editable}
          />
        </FieldWrapper>
      );
    } else if (field.fieldType === 'phone') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="tel"
              name={field.fieldName}
              placeholder={field.placeholder || '+1 (555) 000-0000'}
              required={field?.required}
              value={formData[field.fieldName] || ''}
              onChange={handleInputChange}
              className="bg-transparent pl-9"
            />
          </div>
        </FieldWrapper>
      );
    } else if (field.fieldType === 'url') {
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="url"
              name={field.fieldName}
              placeholder={field.placeholder || 'https://'}
              required={field?.required}
              value={formData[field.fieldName] || ''}
              onChange={handleInputChange}
              className="bg-transparent pl-9"
            />
          </div>
        </FieldWrapper>
      );
    } else {
      // text, email, number, date, time, password, file
      inner = (
        <FieldWrapper isAutoFilled={isAutoFilled}>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {field.fieldType === 'file' ? (
            <Input
              type="file"
              name={field.fieldName}
              required={field?.required}
              onChange={handleInputChange}
              className="bg-transparent"
            />
          ) : (
            <Input
              type={field.fieldType || field.type || 'text'}
              placeholder={field.placeholder}
              name={field.fieldName}
              className="bg-transparent"
              required={field?.required}
              value={formData[field.fieldName] || ''}
              onChange={handleInputChange}
            />
          )}
        </FieldWrapper>
      );
    }

    return (
      <SortableFieldItem key={fieldId} id={fieldId} editable={editable}>
        {inner}
        {editControls}
      </SortableFieldItem>
    );
  };

  const fieldIds = jsonForm?.formFields?.map((f, i) => getFieldId(f, i)) || [];

  const formBg = formBackground || jsonForm?.formBackground || '#ffffff';

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={onFormSubmit}
      className={`border border-gray-100 p-8 rounded-2xl shadow-lg ${wide ? 'w-full max-w-3xl mx-auto' : 'md:w-[600px]'}`}
      data-theme={selectedTheme}
      style={{
        fontFamily: bodyFont,
        background: formBg,
        boxShadow: selectedStyle?.key === 'boxshadow' ? '5px 5px 0px black' : undefined,
        border: selectedStyle?.key === 'border' ? selectedStyle.value : undefined,
      }}
    >
      <h2
        className="font-bold text-center text-2xl tracking-tight"
        style={{ fontFamily: headingFont }}
      >
        {jsonForm?.formTitle}
      </h2>
      <h2
        className="text-sm text-gray-400 text-center mt-1 mb-6"
        style={{ fontFamily: headingFont }}
      >
        {jsonForm?.formSubheading}
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
          {jsonForm?.formFields?.map((field, index) => renderField(field, index))}
        </SortableContext>
      </DndContext>

      <div className="mt-6">
        {!enabledSignIn ? (
          <button type="submit" className="btn btn-primary w-full">Submit</button>
        ) : isSignedIn ? (
          <button type="submit" className="btn btn-primary w-full">Submit</button>
        ) : (
          <Button className="w-full">
            <SignInButton mode="modal">Sign In to Submit</SignInButton>
          </Button>
        )}
      </div>
    </form>
  );
}

export default FormUi;
