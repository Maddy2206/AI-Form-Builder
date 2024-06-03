import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Themes from '@/app/_data/Themes';
import GradientBg from '@/app/_data/GradientBg';
import { Button } from '@/components/ui/button';

function Controller({ selectedTheme, selectedBackground }) {
  const [showMore, setShowMore] = useState(6);
  const [selectedBgIndex, setSelectedBgIndex] = useState(-1); // Initialize with -1 as no background is selected initially

  const handleBackgroundSelection = (index, gradient) => {
    selectedBackground(gradient);
    setSelectedBgIndex(index); // Update the selected background index
  };

  return (
    <div>
      <h2 className='my-1'>Themes</h2>
      <Select onValueChange={(value) => selectedTheme(value)}>
        <SelectTrigger className="w-full mt-3">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Themes.map((theme, index) => (
            <SelectItem value={theme["theme"]} key={index}>
              <div className='flex gap-3'>
                <div className='flex'>
                  <div className='h-5 w-5 rounded-l-md' style={{ backgroundColor: theme["primary"] }}></div>
                  <div className='h-5 w-5' style={{ backgroundColor: theme["secondary"] }}></div>
                  <div className='h-5 w-5' style={{ backgroundColor: theme["accent"] }}></div>
                  <div className='h-5 w-5 rounded-r-md' style={{ backgroundColor: theme["neutral"] }}></div>
                </div>
                {theme["theme"]}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <h2 className='mt-8 my-1'>Background</h2>
      <div className='grid grid-cols-3 gap-4'>
        {GradientBg.map((bg, index) => (index < showMore) && (
          <div 
            key={index}
            onClick={() => handleBackgroundSelection(index, bg.gradient)} 
            className={`w-full h-[50px] rounded-lg flex items-center justify-center cursor-pointer ${
              selectedBgIndex === index ? 'border-black border-2' : 'hover:border-black hover:border-2'
            }`} 
            style={{ background: bg.gradient }}>
            {index === 0 && 'None'}
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className='w-full my-3' onClick={() => setShowMore(showMore > 6 ? 6 : 20)}>
        {showMore > 6 ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
}

export default Controller;
