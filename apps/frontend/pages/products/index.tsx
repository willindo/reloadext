// File: apps/frontend/pages/products/index.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import ProductForm from "../../components/products/ProductForm";
import ProductList from "../../components/products/ProductList";
import { Product, User } from "../../types";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, userId]);

  async function fetchUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function fetchProducts() {
    try {
      const res = await api.get("/products", {
        params: { page, limit, userId: userId || undefined },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  async function handleUpdate(id: string, data: Partial<Product>) {
    try {
      await api.put(`/products/${id}`, data);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📦 Product List</h1> 
      <Link href="/" className="text-red-900 underline">
        Home
      </Link>

      <ProductForm onCreated={fetchProducts} />

      <div style={{ marginBottom: "1rem" }}>
        <label>Select User: </label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">-- All Users --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <ProductList
        products={products}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ⬅️ Prev
        </button>
        <span>Page: {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next ➡️</button>
      </div>
    </div>
  );
}
