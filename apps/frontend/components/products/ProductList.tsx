import { Product } from '../../types';
import ProductItem from './ProductItem';

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
   onUpdate: (id: string, data: Partial<Product>) => void;
}

export default function ProductList({ products, onDelete, onUpdate }: Props) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  );
}
