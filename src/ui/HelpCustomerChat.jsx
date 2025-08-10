import { MessageCircleQuestionMark } from "lucide-react";
import React, { useState } from "react";
import CustomerCareChat from "../components/CustomerCareChat";

const HelpCustomerChat = ({onClick}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating chat icon button */}
      <div
        className="fixed bottom-6 right-6 z-50 w-12 h-12 border rounded-full lg:flex justify-center items-center bg-white shadow-md hover:bg-blue-100 transition duration-300 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircleQuestionMark className="w-5 h-5 text-blue-500" />
      </div>

      {/* Chat popup, show only if isOpen is true */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <CustomerCareChat onClose={()=> setIsOpen(false)} />
        </div>
      )}
    </>
  );
};

export default HelpCustomerChat;
