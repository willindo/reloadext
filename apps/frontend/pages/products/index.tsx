// apps/frontend/pages/products/index.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import ProductForm from "../../components/products/ProductForm";
import ProductList from "../../components/products/ProductList";
import { Product, User } from "../../types";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: session } = useSession();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // if logged in, set userId to session user id for "My Products" view toggle
    if (session?.user?.id && userId === 'me') {
      setUserId(session.user.id);
    }
  }, [session]);

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
      // will require bearer token for protected delete endpoint if you protect it later
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
      <Link href="/">Home</Link>

      <ProductForm onProductAdded={() => fetchProducts()} />

      <div style={{ marginBottom: "1rem" }}>
        <label>Select User: </label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">-- All Users --</option>
          {session?.user?.id && (
            <option value="me">{session.user.name || "My Products"}</option>
          )}
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <ProductList products={products} onDelete={handleDelete} onUpdate={handleUpdate} />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          ⬅️ Prev
        </button>
        <span>Page: {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next ➡️</button>
      </div>
    </div>
  );
}
