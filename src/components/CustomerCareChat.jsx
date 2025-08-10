import React from "react";
import botIcon from "../assets/images/ai.png";
import { X } from "lucide-react";

const CustomerCareChat = ({ onClose }) => {
  return (
    <div className="relative bottom-14 w-72 right-5 font-sans border border-gray-300 rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-purple-700 text-white px-4 py-2 flex items-center gap-2.5">
        <img src={botIcon} alt="Bot" className="w-10 h-10 animate-float" />
        <p className="m-0 font-bold">Customer Support</p>
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded hover:bg-purple-600 cursor-pointer"
          aria-label="Close chat"
        >
          <X size={20} color="white" />
        </button>
      </div>
      {/* Timestamp */}
      <p className="text-center my-2 text-xs text-gray-500">2:56 PM</p>

      {/* Chat Content */}
      <div className="px-4 pb-4">
        <p className="font-bold mb-2">Answer Bot</p>
        <div className="bg-gray-200 p-2.5 rounded-xl text-sm">
          Hello! I am automated assistant ready to help. By using this chat, you
          consent to it being recorded and used by us and third parties. We can
          help you for contact and product details.
        </div>

        {/* Input */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full p-2.5 rounded-full border border-gray-300 outline-none text-sm"
          />
        </div>

        {/* Footer */}
        <div className="mt-2.5 text-xs text-gray-400 text-center">
          Built with Sowis
        </div>
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default CustomerCareChat;
