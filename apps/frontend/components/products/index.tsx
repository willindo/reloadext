'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import ProductForm from '../../components/products/ProductForm';
import ProductList from '../../components/products/ProductList';
import { Product } from '../../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  async function fetchProducts() {
    try {
      const res = await api.get(`/products?page=${page}&limit=${limit}`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📦 Product List</h1>
      <ProductForm onCreated={fetchProducts} />
      <ProductList products={products} onDelete={function (id: string): void {
        throw new Error('Function not implemented.');
      } } onUpdate={function (id: string, data: Partial<Product>): void {
        throw new Error('Function not implemented.');
      } } />

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          ⬅️ Prev
        </button>
        <span>Page: {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next ➡️</button>
      </div>
    </div>
  );
}
