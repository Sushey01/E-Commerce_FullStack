import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const BrandsList = () => {
  type Brand = {
    id: number;
    name: string;
    logoUrl: string;
    category: string[];
  };

  

 const brands: Brand[] = [
   {
     id: 1,
     name: "Acer",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/4/48/Acer_2011.svg",
     category: ["Laptop", "Monitor"],
   },
   {
     id: 2,
     name: "Asus",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/5/56/AsusTek_black_logo.svg",
     category: ["Laptop", "Motherboard", "Gaming"],
   },
   {
     id: 3,
     name: "Dell",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
     category: ["Laptop", "Monitor", "Server"],
   },
   {
     id: 4,
     name: "HP",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/3/32/HP_logo_2012.svg",
     category: ["Laptop", "Printer", "Desktop"],
   },
   {
     id: 5,
     name: "Lenovo",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/6/6f/Lenovo_logo_2015.svg",
     category: ["Laptop", "Tablet", "Smartphone"],
   },
   {
     id: 6,
     name: "Apple",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
     category: ["Smartphone", "Laptop", "Tablet", "Smartwatch"],
   },
   {
     id: 7,
     name: "Samsung",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
     category: ["Smartphone", "TV", "Appliances", "Tablet"],
   },
   {
     id: 8,
     name: "Xiaomi",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
     category: ["Smartphone", "TV", "Smartwatch", "Tablet"],
   },
   {
     id: 9,
     name: "Sony",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/2/2e/Sony_logo.svg",
     category: ["TV", "Camera", "Audio"],
   },
   {
     id: 10,
     name: "LG",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/1/1e/LG_logo_%282015%29.svg",
     category: ["TV", "Appliances", "Monitor"],
   },
   {
     id: 11,
     name: "Realme",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/6/6e/Realme_logo.svg",
     category: ["Smartphone", "Smartwatch"],
   },
   {
     id: 12,
     name: "Huawei",
     logoUrl:
       "https://upload.wikimedia.org/wikipedia/commons/0/00/Huawei_logo.svg",
     category: ["Smartphone", "Tablet", "Networking"],
   },
 ];


  return (
    <div className="space-y-6 flex gap-4 w-full">
      <div className="w-1/2 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex  items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Brands</h2>
          <input
            type="search"
            placeholder="Type name & Enter"
            className="border border-gray-300 text-center rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Logo</th>
                <th className="px-4 py-2 border-b">Options</th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand, index) => (
                <tr
                  key={brand.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{brand.name}</td>
                  <td className="px-4 py-2 border-b">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-10 h-auto"
                    />
                  </td>
                  
                  <td className="px-4 py-2 border-b">
                    <button className="text-gray-600 hover:text-gray-800">
                      <BsThreeDotsVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div className="border rounded-lg py-2 w-1/2 px-4 flex flex-col">
        <div className="w-full">
          <h2 className="text-[18px] ">Add New Brand</h2>
          <form className="flex flex-col gap-5 p-6 bg-white border rounded-xl shadow-sm w-full max-w-2xl mx-auto">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter category name"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Logo Upload */}
            <div className="flex flex-col gap-1">
              <label htmlFor="logo" className="text-gray-700 font-medium">
                Logo
              </label>
              <div className="flex flex-col  gap-3">
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm"
                >
                  Upload
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, SVG
              </p>
            </div>

            {/* Meta Title */}
            <div className="flex flex-col gap-1">
              <label htmlFor="metaTitle" className="text-gray-700 font-medium">
                Meta Title
              </label>
              <input
                id="metaTitle"
                type="text"
                placeholder="Enter meta title for SEO"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Meta Description */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="metaDescription"
                className="text-gray-700 font-medium"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                placeholder="Enter meta description for SEO"
                rows={3}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Meta Keywords */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="metaKeywords"
                className="text-gray-700 font-medium"
              >
                Meta Keywords
              </label>
              <input
                id="metaKeywords"
                type="text"
                placeholder="keyword1, keyword2, keyword3"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400">
                Separate keywords with commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="w-full sm:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 px-4 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandsList;
