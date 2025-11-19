import React, { useState } from "react";
import { ChevronLeft, UploadCloud, Check, X } from "lucide-react";

interface NewMegaDealFormProps {
  onCancel: () => void;
  onSubmit: (newDeal: any) => void;
}

const NewMegaDealForm: React.FC<NewMegaDealFormProps> = ({
  onCancel,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    bannerFile: null as File | null,
    status: true,
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, bannerFile: e.target.files![0] }));
    }
  };

  const handleToggle = (name: "status" | "featured") => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

 const handleSubmit = (e: React.FormEvent) => {
   e.preventDefault();

   const dealId = Date.now();

   const newDeal = {
     id: dealId,
     title: formData.title,
     startDate: formData.startDate,
     endDate: formData.endDate,
     status: formData.status,
     featured: formData.featured,

     // Create a preview URL from the file for customer UI
     image: formData.bannerFile
       ? URL.createObjectURL(formData.bannerFile)
       : "https://via.placeholder.com/600x400",
   };

   onSubmit(newDeal);
 };


  // Status/Featured Toggle component used in the form
  const ToggleSwitch: React.FC<{
    name: "status" | "featured";
    isChecked: boolean;
  }> = ({ name, isChecked }) => (
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        isChecked ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"
      }`}
      onClick={() => handleToggle(name)}
    >
      <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10 space-y-6">
      <div
        className="flex items-center justify-between space-x-3 text-purple-600 cursor-pointer hover:text-purple-700"
        onClick={onCancel}
      >
        <ChevronLeft className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Create New Flash Deal</h2>
        <button onClick={onCancel} className="text-red-600 flex">
          X
        </button>{" "}
      </div>
      <p className="text-sm text-gray-500">
        Fill in the details below to launch a new promotional flash deal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. TITLE INPUT */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Deal Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Summer Clearance Sale"
            className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
            required
          />
        </div>

        {/* 2. DATE PICKERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              End Date & Time
            </label>
            <input
              type="datetime-local"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
              required
            />
          </div>
        </div>

        {/* 3. BANNER UPLOAD */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Deal Banner Image (600x400 Recommended)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="bannerFile"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-150"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  {formData.bannerFile
                    ? `File Selected: ${formData.bannerFile.name}`
                    : "SVG, PNG, JPG or GIF (MAX. 800x400px)"}
                </p>
              </div>
              <input
                id="bannerFile"
                name="bannerFile"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* 4. TOGGLES (Status and Featured) */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-inner">
            <label className="text-sm font-medium text-gray-700">
              Set as Featured Deal
            </label>
            <ToggleSwitch name="featured" isChecked={formData.featured} />
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-inner">
            <label className="text-sm font-medium text-gray-700">
              Initial Status (Active)
            </label>
            <ToggleSwitch name="status" isChecked={formData.status} />
          </div>
        </div>

        {/* 5. ACTION BUTTONS */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-150 shadow-md shadow-purple-200"
          >
            <Check className="w-4 h-4 mr-2" /> Save Deal
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewMegaDealForm;
