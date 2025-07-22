'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products?page=1').then(res => setProducts(res.data))
  }, [])

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
    </div>
  )
}