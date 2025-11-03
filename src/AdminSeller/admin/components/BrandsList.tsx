import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type Brand = {
  id: number;
  name: string;
  logoUrl: string;
  category: string[];
};

const BrandsList = () => {
  const [brands, setBrands] = useState<Brand[]>([
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
  ]);

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // Controlled form state
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);

  const handleEdit = (brand: Brand) => {
    console.log("Edit:", brand);
    setOpenMenu(null);
  };

  const handleDelete = (id: number) => {
    setBrands(brands.filter((brand) => brand.id !== id));
    setOpenMenu(null);
  };

  const handleSaveBrand = () => {
    if (!newBrandName) return;

    // In a real app you would upload the logo file and get a URL
    const newBrand: Brand = {
      id: Date.now(),
      name: newBrandName,
      logoUrl: newBrandLogo
        ? URL.createObjectURL(newBrandLogo)
        : "https://via.placeholder.com/100x40?text=Logo",
      category: [],
    };

    setBrands([...brands, newBrand]);
    setNewBrandName("");
    setNewBrandLogo(null);
  };

  return (
    <div className="space-y-6 flex flex-col md:flex-row gap-4 w-full">
      {/* Brand List */}
      <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Brands</h2>
          <input
            type="search"
            placeholder="Type name & Enter"
            className="border border-gray-300 text-center rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
                  className="hover:bg-gray-50 transition duration-200 relative"
                >
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{brand.name}</td>
                  <td className="px-4 py-2 border-b">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-16 h-10 object-contain bg-white p-1"
                    />
                  </td>
                  <td className="px-4 py-2 border-b relative">
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() =>
                        setOpenMenu(openMenu === brand.id ? null : brand.id)
                      }
                    >
                      <BsThreeDotsVertical size={18} />
                    </button>
                    {openMenu === brand.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border rounded shadow-lg w-28 z-10">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Brand Form */}
      <div className="border rounded-lg py-2 w-full md:w-1/2 px-4 flex flex-col">
        <h2 className="text-[18px] font-semibold mb-4">Add New Brand</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // ✅ prevents full page reload
            handleSaveBrand();
          }}
          className="flex flex-col gap-5 p-6 bg-white border rounded-xl shadow-sm w-full max-w-2xl mx-auto"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Enter brand name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="logo" className="text-gray-700 font-medium">
              Logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setNewBrandLogo(e.target.files[0])
              }
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG, SVG
            </p>
          </div>

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
  );
};

export default BrandsList;
