import { useState } from "react";
import { useSession } from "next-auth/react";
import api from "../../lib/api";
import { Product } from "../../types";

interface ProductFormProps {
  onProductAdded: (product: Product) => void;
}

export default function ProductForm({ onProductAdded }: ProductFormProps) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const headers = session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {};

      // No need to send userId — backend will set from req.user.id
      const { data } = await api.post<Product>("/products", form, { headers });
      onProductAdded(data);

      setForm({ name: "", description: "", price: 0 });
    } catch (err) {
      console.error("Error adding product", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: parseFloat(e.target.value) })
        }
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
