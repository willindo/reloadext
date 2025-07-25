import { useState } from "react";
import { Product } from "../../types";

interface Props {
  product: Product;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Product>) => void;
}

export default function ProductItem({ product, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price.toString());

  function handleSave() {
    onUpdate(product.id, {
      name,
      description,
      price: parseFloat(price),
    });
    setEditing(false);
  }
  return (
    <li
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "8px",
      }}
    >
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={handleSave}>💾 Save</button>{" "}
            <button onClick={() => setEditing(false)}>❌ Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <strong>₹{product.price}</strong>
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={() => setEditing(true)}>✏️ Edit</button>{" "}
            <button
              onClick={() => onDelete(product.id)}
              style={{ color: "red" }}
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
