import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import  api  from "../../lib/api";
import { Product, User } from "../../types";
import ProductForm from "../../components/products/ProductForm";
import ProductList from "../../components/products/ProductList";
import Link from "next/link";


export default function MyProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch only my products
  const fetchMyProducts = async () => {
    if (!session?.accessToken) return;
    try {
      const { data } = await api.get<Product[]>("/products/me", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching my products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      fetchMyProducts(); // refresh list
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Add product callback
  const handleAddProduct = async (productData: Omit<Product, "id" | "userId">) => {
    if (!session?.accessToken) return;
    try {
      await api.post("/products", productData, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      fetchMyProducts(); // refresh list
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [session?.accessToken]);

  if (!session) return <p>Please log in to view your products.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{session.user?.name}’s Products</h1>
      <Link href="/">⬅ Back to Home</Link>

      <h2>Add a New Product</h2>
      <ProductForm onProductAdded={handleAddProduct} />

      <h2>Your Products</h2>
      {products.length > 0 ? (
        <ProductList products={products} onDelete={handleDelete} />
      ) : (
        <p>No products yet. Add your first one!</p>
      )}
    </div>
  );
}
