import React from "react";
import { X } from "lucide-react";

interface FormRowProps {
  label: string;
  helper: string;
  children: React.ReactNode;
  required?: boolean;
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  helper,
  children,
  required = true,
}) => (
  <div className="flex items-start mb-6">
    <div className="w-1/3 pr-8 pt-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <p className="text-xs text-gray-500 mt-1">{helper}</p>
    </div>
    <div className="w-2/3">{children}</div>
  </div>
);

interface PopupPreviewProps {
  onClose?: () => void;
}

const PopupPreview: React.FC<PopupPreviewProps> = ({ onClose }) => (
  <div className="bg-gray-100 p-8 rounded-lg sticky top-8">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-gray-500 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <div className="w-64 mx-auto bg-white rounded-lg shadow-xl relative overflow-hidden">
      <div className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full">
        <X className="w-3 h-3 text-white" />
      </div>

      <div className="flex">
        <img
          src="https://via.placeholder.com/150/FFD700/000000?text=Model"
          alt="Model"
          className="w-1/2 h-28 object-cover"
        />
        <div className="w-1/2 bg-black p-2 flex flex-col justify-end">
          <img
            src="https://via.placeholder.com/150/333333/FFFFFF?text=Dress"
            alt="Dress"
            className="w-full object-contain"
          />
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-900 mb-1">
          New Flash Sale 'Women's Week' Upto 50% Off
        </h4>

        <p className="text-xs text-gray-600 mb-4">
          Brand new Flash Sale this week for all our Ladies customers. We have
          curated the best for you at a huge discount.
        </p>

        <button className="w-full py-2 text-sm font-semibold text-black bg-yellow-400 rounded-md shadow-md transition hover:bg-yellow-500 flex items-center justify-center space-x-2">
          <span>Visit Now</span>
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>

    <div className="mt-6 space-y-2 text-sm">
      <p className="text-gray-700">**1** Title</p>
      <p className="text-gray-700">**2** Summary</p>
      <p className="text-gray-700">**3** Image</p>
      <p className="text-gray-700">**4** Button with text & link</p>
    </div>
  </div>
);

const AddNewDynamicPopupForm: React.FC = () => {
  return (
    <div className="p-10 bg-white max-w-6xl mx-auto shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">
        Custom Dynamic Popup Information
      </h2>

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2">
          <form>
            <FormRow label="Title" helper="Best within 50 character">
              <input
                type="text"
                placeholder="Type your text here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </FormRow>

            <FormRow label="Summary" helper="Best within 200 character">
              <textarea
                placeholder="Type your text here"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
              ></textarea>
            </FormRow>

            <FormRow label="Image" helper="(1512px X 280px)">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg border border-gray-300 hover:bg-gray-300"
                >
                  Browse
                </button>
                <input
                  type="text"
                  placeholder="Choose file"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
            </FormRow>

            <FormRow label="Button Text" helper="(Best within 30 character)">
              <input
                type="text"
                placeholder="Type your text here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </FormRow>

            <FormRow label="Select Button Color" helper="" required={false}>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  defaultValue="#000000"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <div
                  className="w-8 h-8 rounded-md border border-gray-300"
                  style={{ backgroundColor: "#000000" }}
                ></div>
              </div>
            </FormRow>

            <FormRow label="Button Text Color" helper="" required={true}>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="buttonTextColor"
                    value="light"
                    defaultChecked
                    className="text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Light</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="buttonTextColor"
                    value="dark"
                    className="text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Dark</span>
                </label>
              </div>
            </FormRow>

            <FormRow label="Link" helper="">
              <input
                type="text"
                placeholder="Type your text here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </FormRow>

            <div className="mt-8 ml-auto">
              <button
                type="submit"
                className="px-8 py-3 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-1">
          <PopupPreview />
        </div>
      </div>
    </div>
  );
};

export default AddNewDynamicPopupForm;
