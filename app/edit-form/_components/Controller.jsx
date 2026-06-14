'use client';

import React, { useState } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Themes from '@/app/_data/Themes';
import GradientBg from '@/app/_data/GradientBg';
import {
  Palette, Layers, ChevronDown, X, Plus,
  Type, AlignLeft, ListFilter, CircleDot,
  CheckSquare, Calendar, Star, ALargeSmall, Wand2,
} from 'lucide-react';

const FORM_BACKGROUNDS = [
  // Solids
  { name: 'White',        value: '#ffffff' },
  { name: 'Pearl',        value: '#f8fafc' },
  { name: 'Cream',        value: '#fefce8' },
  { name: 'Blush',        value: '#fdf2f8' },
  // Soft gradients
  { name: 'Sky Wash',     value: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)' },
  { name: 'Lavender',     value: 'linear-gradient(135deg, #ede9fe 0%, #fdf4ff 100%)' },
  { name: 'Mint Frost',   value: 'linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%)' },
  { name: 'Peach Glow',   value: 'linear-gradient(135deg, #fde68a 0%, #fef3c7 100%)' },
  { name: 'Rose Quartz',  value: 'linear-gradient(135deg, #fce7f3 0%, #fff1f2 100%)' },
  { name: 'Horizon',      value: 'linear-gradient(135deg, #bae6fd 0%, #ddd6fe 100%)' },
  // Bold gradients
  { name: 'Ocean',        value: 'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)' },
  { name: 'Sunset',       value: 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)' },
  { name: 'Forest',       value: 'linear-gradient(135deg, #15803d 0%, #4ade80 100%)' },
  { name: 'Aurora',       value: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)' },
  { name: 'Rose Gold',    value: 'linear-gradient(135deg, #e11d48 0%, #fb923c 100%)' },
  { name: 'Midnight',     value: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' },
];

const FONTS = [
  { name: 'Default',          value: 'inherit' },
  { name: 'Inter',            value: 'Inter' },
  { name: 'Poppins',          value: 'Poppins' },
  { name: 'Montserrat',       value: 'Montserrat' },
  { name: 'Roboto',           value: 'Roboto' },
  { name: 'Lato',             value: 'Lato' },
  { name: 'Nunito',           value: 'Nunito' },
  { name: 'DM Sans',          value: 'DM Sans' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather',     value: 'Merriweather' },
];

// Text covers text / email / phone / number / url in one field
const FIELD_TYPES = [
  { type: 'text',     label: 'Text Input',  Icon: Type },
  { type: 'textarea', label: 'Long Text',   Icon: AlignLeft },
  { type: 'select',   label: 'Dropdown',    Icon: ListFilter },
  { type: 'radio',    label: 'Choice',      Icon: CircleDot },
  { type: 'checkbox', label: 'Checkbox',    Icon: CheckSquare },
  { type: 'date',     label: 'Date',        Icon: Calendar },
  { type: 'rating',   label: 'Rating',      Icon: Star },
];

function loadGoogleFont(fontName) {
  if (!fontName || fontName === 'inherit') return;
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function Controller({ selectedTheme, selectedBackground, onClose, onAddField, onFontChange, currentFonts = {}, onFormBgChange, currentFormBg }) {
  const [showMore, setShowMore] = useState(false);
  const [selectedBgIndex, setSelectedBgIndex] = useState(0);
  const [selectedFormBgIndex, setSelectedFormBgIndex] = useState(0);

  const visibleBgs = showMore ? GradientBg : GradientBg.slice(0, 9);

  const handleFontChange = (fontKey, value) => {
    loadGoogleFont(value);
    onFontChange?.(fontKey, value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
              <Palette className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Design</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close toolbar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">

        {/* ── Add Field ── */}
        <div className="px-5 py-5">
          <SectionHeader icon={Plus} label="Add Field" />
          <div className="grid grid-cols-2 gap-1.5">
            {FIELD_TYPES.map(({ type, label, Icon }) => (
              <button
                key={type}
                onClick={() => onAddField?.(type)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 transition-all text-left"
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Form Background ── */}
        <div className="px-5 py-5">
          <SectionHeader icon={Wand2} label="Form Background" />
          <div className="grid grid-cols-4 gap-1.5">
            {FORM_BACKGROUNDS.map((bg, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedFormBgIndex(index);
                  onFormBgChange?.(bg.value);
                }}
                title={bg.name}
                className={`w-full h-9 rounded-lg border transition-all duration-150 focus:outline-none ${
                  selectedFormBgIndex === index
                    ? 'ring-2 ring-gray-900 ring-offset-1 scale-90'
                    : 'hover:scale-90 hover:ring-2 hover:ring-gray-400 hover:ring-offset-1'
                } ${index === 0 ? 'border-gray-200' : 'border-transparent'}`}
                style={{ background: bg.value }}
              />
            ))}
          </div>
        </div>

        {/* ── Typography ── */}
        <div className="px-5 py-5">
          <SectionHeader icon={ALargeSmall} label="Typography" />
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Heading font</p>
              <Select
                value={currentFonts?.heading || 'inherit'}
                onValueChange={(v) => handleFontChange('formHeadingFont', v)}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-gray-50 border-gray-200 hover:border-gray-300">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Body / field font</p>
              <Select
                value={currentFonts?.body || 'inherit'}
                onValueChange={(v) => handleFontChange('formBodyFont', v)}
              >
                <SelectTrigger className="w-full h-9 text-sm bg-gray-50 border-gray-200 hover:border-gray-300">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ── Theme ── */}
        <div className="px-5 py-5">
          <SectionHeader icon={Layers} label="Theme" />
          <Select onValueChange={(value) => selectedTheme(value)}>
            <SelectTrigger className="w-full h-9 text-sm bg-gray-50 border-gray-200 hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {Themes.map((theme, index) => (
                <SelectItem value={theme["theme"]} key={index}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex rounded overflow-hidden flex-shrink-0">
                      <div className="h-4 w-4" style={{ backgroundColor: theme["primary"] }} />
                      <div className="h-4 w-4" style={{ backgroundColor: theme["secondary"] }} />
                      <div className="h-4 w-4" style={{ backgroundColor: theme["accent"] }} />
                      <div className="h-4 w-4" style={{ backgroundColor: theme["neutral"] }} />
                    </div>
                    <span className="capitalize text-sm">{theme["theme"]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Background ── */}
        <div className="px-5 py-5">
          <SectionHeader icon={Palette} label="Background" />
          <div className="grid grid-cols-3 gap-2">
            {visibleBgs.map((bg, index) => (
              <button
                key={index}
                onClick={() => {
                  selectedBackground(bg.gradient);
                  setSelectedBgIndex(index);
                }}
                title={bg.name}
                className={`w-full h-12 rounded-lg transition-all duration-150 focus:outline-none ${
                  selectedBgIndex === index
                    ? 'ring-2 ring-gray-900 ring-offset-1 scale-95'
                    : 'hover:scale-95 hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                } ${index === 0 ? 'bg-white border border-gray-200 text-xs text-gray-400 font-medium' : ''}`}
                style={index !== 0 ? { background: bg.gradient } : undefined}
              >
                {index === 0 && 'None'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors py-1.5"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`} />
            {showMore ? 'Show less' : 'Show more'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Controller;
