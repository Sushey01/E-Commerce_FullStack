import { ChevronDown, Edit3, Mail, Map, ShoppingBag, User } from "lucide-react";
import React from "react";

// Define data for the sections
const profileData = [
  {
    title: "Notes",
    icon: <Edit3 size={16} className="text-gray-500 cursor-pointer" />,
    content: ["First customer and order!"],
  },
  {
    title: "Customer",
    icon: <ChevronDown size={16} className="text-gray-500 cursor-pointer" />,
    items: [
      {
        icon: <User size={16} className="text-gray-500" />,
        label: "Shekhar Magar",
      },
      {
        icon: <ShoppingBag size={16} className="text-gray-500" />,
        label: "1 Order",
      },
    ],
    note: "Customer is tax-exempt",
  },
  {
    title: "Contact Information",
    icon: <Edit3 size={16} className="text-gray-500 cursor-pointer" />,
    items: [
      {
        icon: <Mail size={16} className="text-gray-500" />,
        label: "fasttry3@gmail.com",
      },
    ],
    note: "No phone number",
  },
  {
    title: "Shipping Address",
    icon: <Edit3 size={16} className="text-gray-500 cursor-pointer" />,
    content: [
      "Shekhar Magar",
      "44600 Bhaisepati, Lalitpur",
      "Nepal Hero",
      "Nepal State",
      "+977-9881234757",
    ],
    map: true,
  },
  {
    title: "Billing Address",
    icon: <ChevronDown size={16} className="text-gray-500 cursor-pointer" />,
    content: ["Same as shipping address"],
  },
];

const OrderProfileSection = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {profileData.map((section, idx) => (
        <div
          key={idx}
          className="border rounded-md p-3 bg-white flex flex-col gap-2"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">{section.title}</h2>
            {section.icon}
          </div>

          {/* Items */}
          {section.items &&
            section.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <p className="text-sm text-gray-700">{item.label}</p>
              </div>
            ))}

          {/* Content */}
          {section.content &&
            section.content.map((text, i) => (
              <p key={i} className="text-sm text-gray-700">
                {text}
              </p>
            ))}

          {/* Note */}
          {section.note && (
            <p className="text-sm text-gray-500">{section.note}</p>
          )}

          {/* Map link */}
          {section.map && (
            <div className="flex items-center gap-2 pt-2">
              <Map size={16} className="text-purple-500" />
              <p className="text-sm text-purple-500 cursor-pointer">View Map</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderProfileSection;
