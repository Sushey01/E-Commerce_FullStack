import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Lock, Edit, Trash2, X, Upload } from "lucide-react";

// @ts-ignore
import Iphone from "../../../../assets/images/iphone.webp";

// @ts-ignore
import HeadPhone from "../../../../assets/images/headphone.png";

// --- 1. ActionDropdown Component ---
const ActionDropdown = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAction = (action: string) => {
    setIsOpen(false);
    if (action === "edit") {
      onEdit();
    } else if (action === "delete") {
      onDelete();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 transition duration-150 ease-in-out bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none"
      >
        <ChevronDown className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => handleAction("edit")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => handleAction("delete")}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. FormRow Component ---
const FormRow = ({
  label,
  helper,
  children,
  required = true,
}: {
  label: string;
  helper: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="flex flex-col md:flex-row items-start mb-6">
    <div className="w-full md:w-1/3 pr-8 pt-2 mb-1 md:mb-0">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <p className="text-xs text-gray-500 mt-1 hidden sm:block">{helper}</p>
    </div>
    <div className="w-full md:w-2/3">{children}</div>
  </div>
);

// --- 3. PopupPreview Component ---
interface FormData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  popupType: "alert" | "seasonal" | "gadget";
  backgroundColor: string;
  textColor: string;
  image: string;
}

const PopupPreview = ({ formData }: { formData: FormData }) => {
  const {
    title,
    description,
    buttonText,
    popupType,
    backgroundColor,
    textColor,
    image,
  } = formData;

  // Alert Type (similar to PromoteCustomAlertWebsite)
  if (popupType === "alert") {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Preview - Alert Type
        </h3>
        <div
          className="relative w-full max-w-xs mx-auto rounded-lg shadow-xl p-4"
          style={{ backgroundColor, color: textColor }}
        >
          <div className="absolute top-[-15px] left-[-15px] transform rotate-[-10deg]">
            <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              NEW
            </div>
          </div>
          <button className="absolute top-1 right-1 p-1 opacity-50 hover:opacity-100 transition">
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm mt-2">
            {description ||
              "Introducing Dynamic Custom Alerts! With custom trigger."}
          </p>
        </div>
      </div>
    );
  }

  // Seasonal Type (similar to SeasonalPromotionBanner)
  if (popupType === "seasonal") {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Preview - Seasonal Type
        </h3>
        <div className="relative w-full max-w-xs mx-auto rounded-lg shadow-xl overflow-hidden bg-white">
          <div className="relative h-40 bg-yellow-200">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <button className="absolute top-2 right-2 p-1 text-white bg-black bg-opacity-40 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4" style={{ backgroundColor, color: textColor }}>
            <p className="text-base font-bold mb-1">
              {title || "Hurry Up! Sale ending soon"}
            </p>
            <p className="text-sm">
              {description || "Click here to see products."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Gadget Type (similar to NewGadgetAlertPromotion)
  if (popupType === "gadget") {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Preview - Gadget Type
        </h3>
        <div
          className="relative w-full max-w-xs mx-auto flex items-center rounded-lg shadow-xl p-4"
          style={{ backgroundColor, color: textColor }}
        >
          <div className="flex-shrink-0 w-1/3 mr-3">
            {image ? (
              <img
                src={image}
                alt="Gadget"
                className="w-full h-auto object-cover rounded"
              />
            ) : (
              <div className="w-full h-20 bg-gray-300 rounded flex items-center justify-center text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-semibold leading-tight">
              {description || "New Gadget Fare. Click here to view products."}
            </p>
          </div>
          <button className="absolute top-2 right-2 p-1 opacity-50 hover:opacity-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

// --- 4. AddNewDynamicPopupForm ---
const AddNewDynamicPopupForm = ({
  onClose,
  onSave,
  editData,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: any;
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: editData?.title || "",
    description: editData?.description || "",
    buttonText: editData?.buttonText || "Shop Now",
    buttonLink: editData?.buttonLink || "",
    popupType: editData?.popupType || "alert",
    backgroundColor: editData?.backgroundColor || "#374151",
    textColor: editData?.textColor || "#ffffff",
    image: editData?.image || "",
  });

  const [imagePreview, setImagePreview] = useState(editData?.image || "");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl p-4 sm:p-8 mx-auto bg-white rounded-lg shadow-2xl">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              {editData ? "Edit" : "Create"} Dynamic Popup
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <FormRow label="Popup Type" helper="Choose popup style">
                  <select
                    name="popupType"
                    value={formData.popupType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="alert">Alert Type (NEW Badge)</option>
                    <option value="seasonal">
                      Seasonal Type (Image Header)
                    </option>
                    <option value="gadget">Gadget Type (Image + Text)</option>
                  </select>
                </FormRow>

                <FormRow label="Title" helper="Best within 50 characters">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Huge Winter Sale"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </FormRow>

                <FormRow
                  label="Description"
                  helper="Best within 200 characters"
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Type your promotional message here"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  ></textarea>
                </FormRow>

                <FormRow
                  label="Button Text"
                  helper="Call to action text"
                  required={false}
                >
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormRow>

                <FormRow
                  label="Link"
                  helper="URL to redirect on click"
                  required={false}
                >
                  <input
                    type="url"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormRow>

                <FormRow
                  label="Image"
                  helper="For seasonal and gadget types"
                  required={false}
                >
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </FormRow>

                <FormRow label="Background Color" helper="Popup background">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleInputChange}
                      className="h-10 w-16 cursor-pointer rounded border"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          backgroundColor: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormRow>

                <FormRow label="Text Color" helper="Text and icon color">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleInputChange}
                      className="h-10 w-16 cursor-pointer rounded border"
                    />
                    <input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          textColor: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </FormRow>

                <div className="mt-8 flex gap-3">
                  <button
                    type="submit"
                    className="px-8 py-3 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    {editData ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 text-gray-700 font-semibold bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <div className="md:col-span-1 order-first md:order-last">
              <PopupPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 5. PopupRow Component ---
const PopupRow = ({
  popup,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  popup: any;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) => {
  const {
    title,
    image,
    buttonLink,
    isLocked = false,
    isActive = true,
    popupType,
  } = popup;

  return (
    <div className="grid grid-cols-2 md:grid-cols-12 md:gap-4 items-center py-4 border-b border-gray-100 last:border-b-0 px-4 md:px-0">
      <div className="col-span-1 md:col-span-4 flex items-center space-x-3">
        <input
          type="checkbox"
          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 flex-shrink-0"
        />

        <div className="relative w-12 h-12 flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
              No Img
            </div>
          )}
          {isLocked && (
            <Lock className="w-4 h-4 text-gray-400 absolute top-0 left-0 mt-[-4px] ml-[-4px] bg-white rounded-full p-[1px]" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-gray-800 truncate">
            {title}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {popupType} Type
          </span>
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 truncate hover:underline md:hidden"
          >
            {buttonLink}
          </a>
        </div>
      </div>

      <div className="hidden md:block md:col-span-4 text-sm text-blue-600 truncate">
        <a href={buttonLink} target="_blank" rel="noopener noreferrer">
          {buttonLink || "No link"}
        </a>
      </div>

      <div className="col-span-1 md:col-span-4 flex items-center justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 md:hidden">Status:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={onToggleActive}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <ActionDropdown onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

// --- 6. DynamicPopUp Component (Main view) ---
const DynamicPopUp = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<any>(null);
  const [popups, setPopups] = useState([
    {
      id: 1,
      title: "Subscribe to Our Newsletter",
      description: "Get the latest updates and offers",
      buttonText: "Subscribe",
      buttonLink: "https://example.com/newsletter",
      popupType: "alert",
      backgroundColor: "#374151",
      textColor: "#ffffff",
      image: "",
      isLocked: true,
      isActive: true,
    },
    {
      id: 2,
      title: "Huge Winter Sale",
      description: "Hurry Up! The huge winter sale will end very soon.",
      buttonText: "Shop Now",
      buttonLink: "https://codecanyon.net/item/active-ecommerce-cms",
      popupType: "seasonal",
      backgroundColor: "#1f2937",
      textColor: "#ffffff",
      image: HeadPhone,
      isLocked: false,
      isActive: true,
    },
    {
      id: 3,
      title: "New Gadget Alert",
      description:
        "New Gadget Fare in Active eCommerce CMS. Click here to view the products.",
      buttonText: "View Products",
      buttonLink: "https://codecanyon.net/item/active-ecommerce-cms",
      popupType: "gadget",
      backgroundColor: "#5eead4",
      textColor: "#1f2937",
      image: Iphone,
      isLocked: false,
      isActive: false,
    },
  ]);

  const handleSave = (formData: any) => {
    if (editingPopup) {
      // Update existing popup
      setPopups((prev) =>
        prev.map((p) =>
          p.id === editingPopup.id
            ? { ...formData, id: p.id, isActive: p.isActive }
            : p
        )
      );
    } else {
      // Add new popup
      const newPopup = {
        ...formData,
        id: Date.now(),
        isActive: true,
        isLocked: false,
      };
      setPopups((prev) => [...prev, newPopup]);
    }
    setEditingPopup(null);
  };

  const handleEdit = (popup: any) => {
    setEditingPopup(popup);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this popup?")) {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setPopups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPopup(null);
  };

  return (
    <div className="p-4 sm:p-8 bg-white mx-auto shadow-xl rounded-lg">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Dynamic Popups
        </h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto px-5 py-2 text-white transition duration-150 ease-in-out bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Create New Dynamic Popup
        </button>
      </header>

      <hr className="mb-6" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-3 md:space-y-0">
        <h2 className="text-xl font-medium text-gray-700">
          All Dynamic Popups ({popups.length})
        </h2>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select className="block w-full px-4 py-2 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500">
              <option>Bulk Action</option>
              <option>Delete Selected</option>
              <option>Activate Selected</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Type name & Enter"
            className="w-full sm:w-48 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 items-center text-sm font-medium text-gray-500 bg-gray-50 border-b border-gray-200 py-3 px-4">
          <div className="md:col-span-4">Image/Title</div>
          <div className="md:col-span-4">Link</div>
          <div className="md:col-span-4 text-right pr-4">Status & Actions</div>
        </div>

        <div className="p-0">
          {popups.map((popup) => (
            <PopupRow
              key={popup.id}
              popup={popup}
              onEdit={() => handleEdit(popup)}
              onDelete={() => handleDelete(popup.id)}
              onToggleActive={() => handleToggleActive(popup.id)}
            />
          ))}
        </div>
      </div>

      {isFormOpen && (
        <AddNewDynamicPopupForm
          onClose={handleCloseForm}
          onSave={handleSave}
          editData={editingPopup}
        />
      )}
    </div>
  );
};

export default DynamicPopUp;
