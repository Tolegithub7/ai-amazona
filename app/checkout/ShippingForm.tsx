"use client";
import { useState } from "react";

export type ShippingInfo = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default function ShippingForm({ onSubmit }: { onSubmit: (info: ShippingInfo) => void }) {
  const [form, setForm] = useState<ShippingInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email || !form.address || !form.city || !form.state || !form.zip || !form.country) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-card rounded shadow flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2">Shipping Information</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="input" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" type="email" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className="input" />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Street Address" className="input" required />
      <div className="flex gap-2">
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input flex-1" required />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="input flex-1" required />
      </div>
      <div className="flex gap-2">
        <input name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" className="input flex-1" required />
        <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input flex-1" required />
      </div>
      <button type="submit" className="btn btn-primary mt-4">Continue to Payment</button>
    </form>
  );
} 