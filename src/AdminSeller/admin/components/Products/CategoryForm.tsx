// src/components/CategoryForm.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

// Category type
export type Category = {
  id?: string; // uuid, optional for editing context
  name: string;
  type: "Physical" | "Digital";
  banner?: File | null;
  icon?: File | null;
  coverImage?: File | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

// Props for CategoryForm
type CategoryFormProps = {
  category?: Partial<Category>;
  onSave: (category: Omit<Category, "id">) => void;
};

// No parent categories for main categories

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave }) => {
  const [name, setName] = useState(category?.name || "");
  const [type, setType] = useState<Category["type"]>(
    category?.type || "Physical"
  );
  const [metaTitle, setMetaTitle] = useState(category?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    category?.metaDescription || ""
  );
  const [metaKeywords, setMetaKeywords] = useState(
    category?.metaKeywords || ""
  );

  const [banner, setBanner] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Handle file upload
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      banner,
      icon,
      coverImage,
      metaTitle,
      metaDescription,
      metaKeywords,
    });
  };

  // FileUploadBox Component
  type FileUploadBoxProps = {
    label: string;
    file: File | null;
    preview: string | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    setPreview: React.Dispatch<React.SetStateAction<string | null>>;
    minSize: string;
  };

  const FileUploadBox: React.FC<FileUploadBoxProps> = ({
    label,
    file,
    preview,
    setFile,
    setPreview,
    minSize,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="border border-gray-300 rounded-md p-4">
        {file ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview!}
                alt={label}
                className="w-32 h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFile(setFile, setPreview)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {file.name} • {(file.size / 1024).toFixed(1)} KB
            </p>
            <p className="text-xs text-gray-400">
              Minimum dimensions required: {minSize}
            </p>
          </div>
        ) : (
          <label className="cursor-pointer block text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e, setFile, setPreview)}
              className="hidden"
            />
            <div className="space-y-1 text-gray-500">
              <div className="mx-auto w-10 h-10 bg-gray-200 border-2 border-dashed rounded-xl" />
              <p className="text-sm">Browse</p>
              <p className="text-xs">1 File selected</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Category["type"])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
            </select>
          </div>
        </div>

        {/* Removed Ordering Number for main categories */}

        {/* File Uploads */}
        <FileUploadBox
          label="Banner"
          file={banner}
          preview={bannerPreview}
          setFile={setBanner}
          setPreview={setBannerPreview}
          minSize="150px x 150px"
        />
        <FileUploadBox
          label="Icon"
          file={icon}
          preview={iconPreview}
          setFile={setIcon}
          setPreview={setIconPreview}
          minSize="150px x 150px"
        />
        <FileUploadBox
          label="Cover Image"
          file={coverImage}
          preview={coverPreview}
          setFile={setCoverImage}
          setPreview={setCoverPreview}
          minSize="375px x 375px"
        />

        {/* Meta Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Keywords
            </label>
            <input
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Removed Slug for main categories */}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
