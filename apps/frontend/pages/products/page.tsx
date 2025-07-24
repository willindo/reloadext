'use client'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

type Product = {
  id: string;
  name: string;
  description: string;
};

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//    const fetchProducts = async () => {
//   try {
//     const res = await api.get('products');
//     console.log('✅ Response from backend:', res.data);  // <-- Add this
//     setProducts(res.data.products);
//   } catch (error) {
//     console.error('❌ Failed to fetch products:', error);
//   } finally {
//     setLoading(false);
//   }
// };


//     fetchProducts();
//   }, []);

//   if (loading) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Products</h1>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <ul className="space-y-2">
//           {products.map((product) => (
//             <li key={product.id} className="border p-4 rounded shadow">
//               <h2 className="text-xl font-semibold">{product.name}</h2>
//               <p className="text-gray-700">{product.description}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

