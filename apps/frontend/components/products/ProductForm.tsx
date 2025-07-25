'use client';

import { useState } from 'react';
import { api } from '../../lib/api';

interface Props {
  onCreated: () => void;
}

export default function ProductForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/products', {
        name,
        description,
        price: parseFloat(price),
      });

      setName('');
      setDescription('');
      setPrice('');
      onCreated(); // Refresh product list
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        style={{ marginRight: '1rem' }}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        style={{ marginRight: '1rem' }}
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
        step="0.01"
        style={{ marginRight: '1rem' }}
      />
      <button type="submit">➕ Add Product</button>
    </form>
  );
}
