// apps/frontend/components/products/ProductForm.tsx
"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useSession } from "next-auth/react";
import { Product } from "../../types";

export default function ProductForm({ onProductAdded }: { onProductAdded: (p: Product) => void }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", description: "", price: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("You must be logged in to add a product");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
    };

    const headers = session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {};

    const { data } = await api.post<Product>("/products", payload, { headers });

    onProductAdded(data);
    setForm({ name: "", description: "", price: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input type="text" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" value={String(form.price)} onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add Product</button>
    </form>
  );
}
