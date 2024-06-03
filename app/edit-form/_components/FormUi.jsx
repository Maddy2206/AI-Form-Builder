import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { Toast } from "@/components/ui/toast";
import { userResponses } from "@/configs/schema";
import moment from "moment";
import { toast } from "sonner";
import { db } from "@/configs";



function FormUi({ jsonForm, onFieldUpdate, deleteField, selectedTheme, editable = true,formId=0 }) {
  const [formData, setFormData] = useState({});
  let formRef=useRef()
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const onFormSubmit =async (event) => {
    event.preventDefault();
    console.log(formData);

    const result=await db.insert(userResponses).values({
      jsonResponse:formData,
      createdAt:moment().format('DD/MM/YYYY'),
      formRef:formId
    });

    if(result){
      formRef.reset();
      toast('Response Submitted successfully')
    }
    else{
      toast('Internal server Error')
    }
  };
 const handleSelectChange=(name,value)=>{
  setFormData({
    ...formData,
    [name]: value,
  });
 }

 const handleCheckboxChange=(fieldName,itemName,value)=>{
  const list=formData?.[fieldName]?formData?.[fieldName]:[];
  if(value){
    list.push({
      label:itemName,
      value:value
    })
    setFormData({
      ...formData,
      [fieldName]: list,
    });
  }
  else{
    const result=list.filter((item)=>item.label==itemName);
    setFormData({
      ...formData,
      [fieldName]: result,
    });
  }
 }
  return (
    <form 
    ref={(e)=>formRef=e}
      onSubmit={onFormSubmit}
      className="w-full h-full p-5 rounded-lg" data-theme={selectedTheme}
    >
      <h2 className="font-bold text-2xl text-center">{jsonForm?.formTitle}</h2>
      <h2 className="text-center text-gray-500">{jsonForm?.formSubheading}</h2>
      <div className="grid grid-cols-1 gap-4">
        {jsonForm?.formFields?.map((field, index) => (
          <div key={index} className="flex items-center col-span-1 gap-2">
            {field.fieldType === "select" ? (
              <div className="my-3 w-full">
                <label className="block text-sm text-gray-400 w-full">
                  {field.label}
                </label>
                <Select required={field?.required} onValueChange={(v)=>handleSelectChange(field.fieldName,v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : field.fieldType === "radio" ? (
              <div className="my-3 w-full">
                <label className="block text-sm text-gray-400 w-full">
                  {field.label}
                </label>
                <RadioGroup required={field?.required} onChange={handleInputChange} name={field.fieldName}>
                  {field.options.map((item, index) => (
                    <div className="flex items-center space-x-2" key={index}>
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : field.fieldType === "checkbox" ? (
              <div className="my-3 w-full">
                <label className="block text-sm text-gray-400 w-full">
                  {field.label}
                </label>
                {field.options ? (
                  field.options.map((item, index) => (
                    <div className="flex gap-2 items-center mb-2" key={index}>
                      <Checkbox onCheckedChange={(v)=>handleCheckboxChange(field?.label,item.label,v)}   id={item.value}  name={field.fieldName} onChange={handleInputChange} />
                      <Label htmlFor={item.value}>{item.label}</Label>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2 items-center">
                    <Checkbox id={field.fieldName} name={field.fieldName} onChange={handleInputChange} />
                    <Label htmlFor={field.fieldName}>{field.label}</Label>
                  </div>
                )}
              </div>
            ) : field.fieldType === "textarea" ? (
              <div className="my-3 w-full">
                <label className="block text-sm text-gray-400 w-full">
                  {field.label}
                </label>
                <textarea
                  placeholder={field.placeholder}
                  name={field.fieldName}
                  className="w-full p-2 border rounded-md"
                  required={field?.required}
                  onChange={handleInputChange}
                />
              </div>
            ) : field.fieldType === "submit" ? (
              <div className="my-3 w-full">
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
                  {field.label}
                </button>
              </div>
            ) : (
              <div className="my-3 w-full">
                <label className="block text-sm text-gray-400 w-full">
                  {field.label}
                </label>
                <Input
                  type={field.fieldType}
                  placeholder={field.placeholder}
                  name={field.fieldName}
                  className="w-full"
                  required={field?.required}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {editable && <div>
              <FieldEdit
                defaultValue={field}
                onUpdate={(value) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>}
          </div>
        ))}
      </div>
      <button type='submit' className="btn btn-primary rounded-lg">Submit</button>
    </form>
  );
}

export default FormUi;
