import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import Spinner from "../Spinner";

const emptyForm = {
  id: null,
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;

  // Shape-normalizer: supports both old JSON address schema and new flattened columns
  const normalizeRow = (a) => {
    const addr = a?.address || {};
    const full_name =
      a.full_name ||
      [addr.firstname, addr.lastname].filter(Boolean).join(" ") ||
      a.label ||
      "";
    const phone = a.phone || addr.phonenumber || addr.phone || "";
    const line1 = a.line1 || addr.street || addr.address || "";
    const line2 = a.line2 || addr.landmark || "";
    const city = a.city || addr.city || "";
    const state = a.state || addr.province || addr.state || "";
    const postal_code =
      a.postal_code || addr.postal_code || addr.postalno || "";
    const country = a.country || addr.country || "";
    const is_default = a.is_default ?? false;
    return {
      id: a.id,
      user_id: a.user_id,
      full_name,
      phone,
      line1,
      line2,
      city,
      state,
      postal_code,
      country,
      is_default,
    };
  };

  // Fetch addresses from Supabase
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const normalized = (data || []).map(normalizeRow);
      setAddresses(normalized);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setForm({
      id: address.id,
      fullName: address.full_name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,
      country: address.country,
      isDefault: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      fetchAddresses();
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Reset all defaults
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      // Set selected address as default
      await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id);

      fetchAddresses();
      if (returnTo) {
        // After choosing default during checkout flow, return to order page
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.country
    ) {
      alert("Please fill required fields (Name, Phone, Line1, City, Country)");
      return;
    }

    try {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      if (form.isDefault) {
        // Reset other defaults
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from("addresses")
          .update({
            type: "shipping",
            // Store all fields inside JSONB as per your schema
            address: {
              full_name: form.fullName,
              phone: form.phone,
              line1: form.line1,
              line2: form.line2,
              city: form.city,
              state: form.state,
              postal_code: form.postalCode,
              country: form.country,
            },
            is_default: form.isDefault,
          })
          .eq("id", editingId)
          .eq("user_id", user.id);
        if (error) {
          alert(`Error updating address: ${error.message}`);
          return;
        }
      } else {
        // Insert new
        const { data: inserted, error } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            type: "shipping",
            label: null,
            address: {
              full_name: form.fullName,
              phone: form.phone,
              line1: form.line1,
              line2: form.line2,
              city: form.city,
              state: form.state,
              postal_code: form.postalCode,
              country: form.country,
            },
            is_default: form.isDefault,
          })
          .select()
          .single();
        if (error) {
          alert(`Error adding address: ${error.message}`);
          return;
        }
      }

      resetForm();
      fetchAddresses(); // Refresh list
      // If this was marked default and we're in a return flow, go back
      if (form.isDefault && returnTo) {
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      console.error("Error saving address:", err);
      alert(`Error saving address: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Address Book</h2>
        <div className="flex items-center gap-2">
          {returnTo && (
            <button
              className="px-3 py-1 rounded border text-sm"
              onClick={() => navigate(returnTo, { replace: true })}
            >
              Done
            </button>
          )}
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            Add New Address
          </button>
        </div>
      </div>

      {/* List */}
      {addresses.length === 0 ? (
        <div className="text-gray-600 text-sm border rounded p-4">
          No addresses saved yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2  gap-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={`border   p-4 space-y-1 ${
                a.is_default ? "ring-1 ring-blue-400" : ""
              }`}
            >
              <div className="flex  justify-between items-start mb-1">
                <p className=" font-semibold">{a.full_name}</p>
                {a.is_default && (
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{a.line1}</p>
              {a.line2 && <p className="text-sm text-gray-700">{a.line2}</p>}
              <p className="text-sm text-gray-700">
                {a.city}, {a.state} {a.postal_code}
              </p>
              <p className="text-sm text-gray-700">{a.country}</p>
              <p className="text-sm text-gray-500">📞 {a.phone}</p>

              <div className="flex gap-2 pt-2">
                <button
                  className="px-3 py-1 text-sm rounded border"
                  onClick={() => handleEdit(a)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm rounded border text-red-600"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </button>
                {!a.is_default && (
                  <button
                    className="px-3 py-1 text-sm rounded bg-gray-800 text-white"
                    onClick={() => handleSetDefault(a.id)}
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded p-4 space-y-3">
          <h3 className="font-semibold">
            {editingId ? "Edit Address" : "Add Address"}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              placeholder="Full Name"
              className="border p-2 rounded"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              placeholder="Phone"
              className="border p-2 rounded"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              placeholder="Address Line 1"
              className="border p-2 rounded md:col-span-2"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
            />
            <input
              placeholder="Address Line 2"
              className="border p-2 rounded md:col-span-2"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
            />
            <input
              placeholder="City"
              className="border p-2 rounded"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              placeholder="State"
              className="border p-2 rounded"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
            <input
              placeholder="Postal Code"
              className="border p-2 rounded"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
            <input
              placeholder="Country"
              className="border p-2 rounded"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
            <label>Set as default address</label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add Address"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressBook;
