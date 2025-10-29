import React, { useEffect, useState } from "react";
import supabase from "../supabase";
import Spinner from "./Spinner";

const ProfileAccountManagement = () => {
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1️⃣ Get auth user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error("No user logged in", authError);
          setLoading(false);
          return;
        }

        // 2️⃣ Check if user_settings exists
        const { data: existing, error: existingError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingError) throw existingError;

        // 3️⃣ If not, create a new record (DON’T overwrite existing)
        if (!existing) {
          await supabase.from("user_settings").insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || "",
            email: user.email,
            phone: "",
            preferences: { city: "" },
          });
        }

        // 4️⃣ Fetch user_settings again (now guaranteed to exist)
        const { data: settings, error: settingsError } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (settingsError) throw settingsError;

        const prefs = settings?.preferences || {};

        // 5️⃣ Fetch users table
        const { data: usersRow, error: usersError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (usersError) throw usersError;

        // 6️⃣ Set form state with proper fallbacks
        setUserData({
          full_name:
            settings?.full_name ||
            usersRow?.full_name ||
            user.user_metadata?.full_name ||
            "",
          email: settings?.email || user.email || "",
          phone: settings?.phone || usersRow?.phone || "",
          city: prefs.city || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in");
        return;
      }

      // 1️⃣ Update user_settings
      const { error: settingsError } = await supabase
        .from("user_settings")
        .upsert(
          {
            user_id: user.id,
            full_name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
            preferences: {
              city: userData.city,
            },
          },
          { onConflict: ["user_id"] }
        );
      if (settingsError) throw settingsError;

      // 2️⃣ Update users table
      const { error: usersError } = await supabase.from("users").upsert(
        {
          id: user.id,
          full_name: userData.full_name,
          phone: userData.phone,
          email: userData.email, // required
        },
        { onConflict: ["id"] }
      );
      if (usersError) throw usersError;

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 flex flex-col gap-4 w-full border rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center py-4 border-b">
        <p className="text-xl font-semibold">Manage My Account</p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label>Full Name</label>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-1">
            <label>Mobile Number</label>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <label>City</label>
            <input
              className="px-4 py-2 w-full border rounded-sm"
              value={userData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>

          {/* Email (readonly) */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label>Email</label>
            <input
              className="px-4 py-2 w-full border rounded-sm bg-gray-100 text-gray-600 cursor-not-allowed"
              value={userData.email}
              readOnly
            />
            <p className="text-sm text-gray-500">
              Your email is linked to your account and cannot be changed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAccountManagement;
