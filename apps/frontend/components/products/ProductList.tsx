import { Product } from "../../types";

export default function ProductList({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id} style={{ marginBottom: "10px" }}>
          <strong>{product.name}</strong> — ${product.price ?? 0}
          <br />
          {product.description}
          <br />
          <button onClick={() => onDelete(product.id)} style={{ color: "red" }}>
            🗑️ Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
