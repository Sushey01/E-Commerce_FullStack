import React, { useEffect, useMemo, useState } from "react";
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

  // Load/save from localStorage for demo persistence
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addressBook") || "[]");
    setAddresses(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("addressBook", JSON.stringify(addresses));
  }, [addresses]);

  const defaultId = useMemo(
    () => addresses.find((a) => a.isDefault)?.id,
    [addresses]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setForm({ ...address });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) resetForm();
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.country
    ) {
      alert(
        "Please fill the required fields (Name, Phone, Address Line 1, City, Country)"
      );
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a))
      );
    } else {
      const id = crypto.randomUUID();
      const newAddress = { ...form, id };
      setAddresses((prev) =>
        newAddress.isDefault
          ? [
              { ...newAddress },
              ...prev.map((a) => ({ ...a, isDefault: false })),
            ]
          : [...prev, newAddress]
      );
    }
    resetForm();
  };

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Address Book</h2>
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          Add New Address
        </button>
      </div>

      {/* List */}
      {addresses.length === 0 ? (
        <div className="text-gray-600 text-sm border rounded p-4">
          No addresses saved yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={`border rounded p-4 space-y-1 ${
                a.isDefault ? "ring-1 ring-blue-400" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold">{a.fullName}</p>
                {a.isDefault && (
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{a.line1}</p>
              {a.line2 && <p className="text-sm text-gray-700">{a.line2}</p>}
              <p className="text-sm text-gray-700">
                {a.city}, {a.state} {a.postalCode}
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
                {!a.isDefault && (
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
            <div>
              <label className="block text-sm">Full Name *</label>
              <input
                className="border rounded w-full p-2"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm">Phone *</label>
              <input
                className="border rounded w-full p-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98XXXXXXXX"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm">Address Line 1 *</label>
              <input
                className="border rounded w-full p-2"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                placeholder="Street, house number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm">Address Line 2</label>
              <input
                className="border rounded w-full p-2"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                placeholder="Apt, suite, etc."
              />
            </div>
            <div>
              <label className="block text-sm">City *</label>
              <input
                className="border rounded w-full p-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm">State</label>
              <input
                className="border rounded w-full p-2"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm">Postal Code</label>
              <input
                className="border rounded w-full p-2"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm">Country *</label>
              <input
                className="border rounded w-full p-2"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
            <label htmlFor="isDefault" className="text-sm">
              Set as default address
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white text-sm"
            >
              {editingId ? "Save Changes" : "Add Address"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border text-sm"
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
