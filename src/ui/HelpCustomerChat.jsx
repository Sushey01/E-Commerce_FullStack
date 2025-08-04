import { MessageCircleQuestionMark } from "lucide-react";
import React from "react";

const HelpCustomerChat = () => {
  return (
    <div className="fixed bottom-6 right-6  z-50 w-12 h-12 border rounded-full hidden lg:flex justify-center items-center bg-white shadow-md hover:bg-blue-100 transition duration-300 cursor-pointer">
      <MessageCircleQuestionMark className="w-5 h-5 text-blue-500" />
    </div>
  );
};

export default HelpCustomerChat;
