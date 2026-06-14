import React, { useState, useEffect } from 'react';
import { Edit, Trash, Plus, X, GripVertical } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CHOICE_TYPES = ['select', 'radio', 'checkbox'];

function RequiredToggle({ required, onChange }) {
  return (
    <div>
      <Label className="text-xs text-gray-500 mb-1.5 block">Response</Label>
      <div className="flex rounded-lg border border-gray-200 p-0.5 gap-0.5">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${
            !required ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Optional
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${
            required ? 'bg-red-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Required
        </button>
      </div>
    </div>
  );
}

function FieldEdit({ defaultValue, onUpdate, deleteField }) {
  const fieldType = defaultValue.fieldType;
  const isChoice = CHOICE_TYPES.includes(fieldType);
  const isRating = fieldType === 'rating';
  const isScale  = fieldType === 'scale';

  const [label, setLabel]       = useState(defaultValue.label || '');
  const [placeholder, setPlaceholder] = useState(defaultValue.placeholder || '');
  const [required, setRequired] = useState(!!defaultValue.required);

  // Choice fields
  const [options, setOptions] = useState(
    (defaultValue.options || []).map((o) => (typeof o === 'string' ? o : o.label))
  );

  // Rating
  const [maxRating, setMaxRating] = useState(defaultValue.maxRating || 5);

  // Scale
  const [scaleMin, setScaleMin]         = useState(defaultValue.min ?? 1);
  const [scaleMax, setScaleMax]         = useState(defaultValue.max ?? 10);
  const [minLabel, setMinLabel]         = useState(defaultValue.minLabel || '');
  const [maxLabel, setMaxLabel]         = useState(defaultValue.maxLabel || '');

  useEffect(() => {
    setLabel(defaultValue.label || '');
    setPlaceholder(defaultValue.placeholder || '');
    setRequired(!!defaultValue.required);
    setOptions((defaultValue.options || []).map((o) => (typeof o === 'string' ? o : o.label)));
    setMaxRating(defaultValue.maxRating || 5);
    setScaleMin(defaultValue.min ?? 1);
    setScaleMax(defaultValue.max ?? 10);
    setMinLabel(defaultValue.minLabel || '');
    setMaxLabel(defaultValue.maxLabel || '');
  }, [defaultValue]);

  const updateOption = (i, val) => {
    const next = [...options];
    next[i] = val;
    setOptions(next);
  };

  const addOption = () => setOptions([...options, '']);

  const removeOption = (i) => setOptions(options.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const value = { label, required };

    if (isChoice) {
      value.options = options.filter(Boolean).map((o) => ({ label: o }));
      if (fieldType === 'select') value.placeholder = placeholder;
    } else if (isRating) {
      value.maxRating = Number(maxRating);
    } else if (isScale) {
      value.min      = Number(scaleMin);
      value.max      = Number(scaleMax);
      value.minLabel = minLabel;
      value.maxLabel = maxLabel;
    } else {
      value.placeholder = placeholder;
    }

    onUpdate(value);
  };

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="focus:outline-none">
            <Edit className="h-4 w-4 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80" side="right" align="start">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Edit Field</h2>

          {/* Label — always shown */}
          <div className="mb-3">
            <Label className="text-xs text-gray-500 mb-1.5 block">Label</Label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Placeholder — text-like fields + dropdown only */}
          {(!isChoice || fieldType === 'select') && !isRating && !isScale && (
            <div className="mb-3">
              <Label className="text-xs text-gray-500 mb-1.5 block">Placeholder</Label>
              <Input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="h-8 text-sm"
                placeholder="Optional hint text"
              />
            </div>
          )}

          {/* ── Choice options editor ── */}
          {isChoice && (
            <div className="mb-3">
              <Label className="text-xs text-gray-500 mb-1.5 block">Options</Label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    <Input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="h-7 text-sm flex-1"
                      placeholder={`Option ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      disabled={options.length <= 1}
                      className="p-0.5 rounded text-gray-300 hover:text-red-400 disabled:opacity-30 transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add option
              </button>
            </div>
          )}

          {/* ── Rating editor ── */}
          {isRating && (
            <div className="mb-3">
              <Label className="text-xs text-gray-500 mb-1.5 block">Max stars</Label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value)}
                  className="flex-1 accent-gray-900"
                />
                <span className="text-sm font-semibold text-gray-700 w-6 text-center">
                  {maxRating}
                </span>
              </div>
            </div>
          )}

          {/* ── Scale editor ── */}
          {isScale && (
            <div className="mb-3 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1.5 block">Min value</Label>
                  <Input
                    type="number"
                    value={scaleMin}
                    onChange={(e) => setScaleMin(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1.5 block">Max value</Label>
                  <Input
                    type="number"
                    value={scaleMax}
                    onChange={(e) => setScaleMax(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1.5 block">Min label</Label>
                  <Input
                    type="text"
                    value={minLabel}
                    onChange={(e) => setMinLabel(e.target.value)}
                    className="h-8 text-sm"
                    placeholder="e.g. Not likely"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500 mb-1.5 block">Max label</Label>
                  <Input
                    type="text"
                    value={maxLabel}
                    onChange={(e) => setMaxLabel(e.target.value)}
                    className="h-8 text-sm"
                    placeholder="e.g. Very likely"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Required toggle — always shown */}
          <div className="mb-5">
            <RequiredToggle required={required} onChange={setRequired} />
          </div>

          <Button size="sm" className="w-full h-8 text-xs" onClick={handleSave}>
            Save changes
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button" className="focus:outline-none">
            <Trash className="h-4 w-4 text-red-400 hover:text-red-600 transition-colors cursor-pointer" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this field?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the field and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteField()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FieldEdit;
