import React, { useState, useEffect, FormEvent } from "react";
import supabase from "../../../../supabase";

// NOTE: For a fully functional RTE, you must install 'react-quill'
// and uncomment the relevant lines below in a live project.
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// --- 1. Type Definitions ---

interface NewsletterFormData {
  emailsUsers: string;
  emailsSubscribers: string;
  subject: string;
  content: string; // Will store the generated HTML content
}

// --- 2. Rich Text Editor Placeholder Component ---
// This simulates the appearance and function of a library like ReactQuill.

const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // In a live project, you would use:
  /*
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'], 
            [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Optional lists
            ['link', 'image'],
            ['clean'] // Remove formatting button
        ],
    };
    
    return (
        <ReactQuill 
            theme="snow" // Or 'bubble'
            value={value} 
            onChange={onChange} 
            modules={modules} 
            placeholder="Compose your newsletter content here..."
            className="h-[250px] pb-10" // Adjust height as needed
        />
    );
    */

  // Using a placeholder structure to run without dependencies:
  return (
    <div className="text-editor-container border border-gray-300 rounded-md">
      {/* Toolbar Area (matches your screenshot icons) */}
      <div className="flex space-x-3 p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
        <button
          type="button"
          className="font-bold border px-2 rounded bg-white shadow-sm hover:bg-gray-100"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className="italic border px-2 rounded bg-white shadow-sm hover:bg-gray-100"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className="underline border px-2 rounded bg-white shadow-sm hover:bg-gray-100"
          title="Underline"
        >
          U
        </button>
        <span className="text-gray-400">|</span>
        <button
          type="button"
          className="hover:text-blue-500 text-lg"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          className="hover:text-blue-500 text-lg"
          title="Image"
        >
          🖼️
        </button>
        <button
          type="button"
          className="hover:text-blue-500 text-lg"
          title="Undo"
        >
          ↩️
        </button>
        <button
          type="button"
          className="hover:text-blue-500 text-lg"
          title="Redo"
        >
          ↪️
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="[Rich Text Editor Placeholder] Compose your newsletter content here..."
        className="w-full resize-none outline-none p-4 h-[250px]"
      />
      <div className="text-right text-xs text-gray-400 border-t pt-1">
        [Resize Handle]
      </div>
    </div>
  );
};

// --- 3. Main Component ---

const NewsLetter: React.FC = () => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    emailsUsers: "",
    emailsSubscribers: "",
    subject: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Fetch counts on component mount
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Get total registered users count
      const { count: usersCount, error: usersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (usersError) {
        console.error("📧 Error fetching users count:", usersError);
      } else {
        setUserCount(usersCount || 0);
      }

      // Get total active newsletter subscribers count
      const { count: subsCount, error: subsError } = await supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      if (subsError) {
        console.error("📧 Error fetching subscribers count:", subsError);
      } else {
        setSubscriberCount(subsCount || 0);
      }
    } catch (error) {
      console.error("📧 Error in fetchCounts:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleContentChange = (newContent: string) => {
    setFormData({
      ...formData,
      content: newContent,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.emailsUsers && !formData.emailsSubscribers) {
      alert(
        "Please select at least one recipient group (Users or Subscribers)"
      );
      return;
    }

    if (!formData.subject.trim()) {
      alert("Please enter a subject for your newsletter");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter content for your newsletter");
      return;
    }

    setLoading(true);

    try {
      let recipientEmails: string[] = [];

      // Fetch emails based on selected groups
      if (formData.emailsUsers === "all-users") {
        const { data: users, error } = await supabase
          .from("users")
          .select("email");

        if (error) throw error;
        if (users) {
          recipientEmails.push(...users.map((u) => u.email));
        }
      }

      if (formData.emailsSubscribers === "all-subscribers") {
        const { data: subscribers, error } = await supabase
          .from("newsletter_subscribers")
          .select("email")
          .eq("is_active", true);

        if (error) throw error;
        if (subscribers) {
          recipientEmails.push(...subscribers.map((s) => s.email));
        }
      }

      // Remove duplicates
      const uniqueEmails = [...new Set(recipientEmails)];

      console.log("📧 Newsletter Data:", {
        subject: formData.subject,
        content: formData.content,
        recipients: uniqueEmails.length,
        emails: uniqueEmails,
      });

      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // For now, we'll just show success message
      alert(
        `Newsletter "${formData.subject}" prepared successfully!\n\n` +
          `Recipients: ${uniqueEmails.length} unique email(s)\n\n` +
          `Note: To actually send emails, integrate with an email service provider (SendGrid, AWS SES, etc.)`
      );

      // Reset form
      setFormData({
        emailsUsers: "",
        emailsSubscribers: "",
        subject: "",
        content: "",
      });
    } catch (error: any) {
      console.error("📧 Error sending newsletter:", error);
      alert(`Error: ${error.message || "Failed to send newsletter"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Send Newsletter
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Emails (Users) Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label
            htmlFor="emailsUsers"
            className="block text-sm font-medium text-gray-700 md:col-span-1"
          >
            Emails (Users)
          </label>
          <div className="md:col-span-3 relative">
            <select
              id="emailsUsers"
              value={formData.emailsUsers}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100"
            >
              <option value="">Nothing selected</option>
              <option value="all-users">
                All Registered Users ({userCount})
              </option>
            </select>
            <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Emails (Subscribers) Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label
            htmlFor="emailsSubscribers"
            className="block text-sm font-medium text-gray-700 md:col-span-1"
          >
            Emails (Subscribers)
          </label>
          <div className="md:col-span-3 relative">
            <select
              id="emailsSubscribers"
              value={formData.emailsSubscribers}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100"
            >
              <option value="">Nothing selected</option>
              <option value="all-subscribers">
                All Newsletter Subscribers ({subscriberCount})
              </option>
            </select>
            <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Newsletter Subject Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 md:col-span-1"
          >
            Newsletter subject
          </label>
          <div className="md:col-span-3">
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              required
            />
          </div>
        </div>

        {/* Newsletter Content (Rich Text Editor) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 pt-2 md:col-span-1"
          >
            Newsletter content
          </label>
          <div className="md:col-span-3">
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsLetter;
