import { Product } from "../../types";
import { useState } from "react";

export default function ProductList({
  products,
  onDelete,
  onUpdate,
  editable = false,
}: {
  products: Product[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Product>) => void;
  editable?: boolean;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditData({ name: product.name, description: product.description, price: product.price });
  };

  const handleSaveClick = () => {
    if (editingId && onUpdate) {
      onUpdate(editingId, editData);
      setEditingId(null);
    }
  };

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id} style={{ marginBottom: "10px" }}>
          {editingId === product.id ? (
            <>
              <input
                type="text"
                value={editData.name ?? ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Name"
              />
              <input
                type="number"
                value={editData.price ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, price: parseFloat(e.target.value) })
                }
                placeholder="Price"
              />
              <input
                type="text"
                value={editData.description ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Description"
              />
              <button onClick={handleSaveClick}>💾 Save</button>
              <button onClick={() => setEditingId(null)}>❌ Cancel</button>
            </>
          ) : (
            <>
              <strong>{product.name}</strong> — ${product.price ?? 0}
              <br />
              {product.description}
              {editable && (
                <>
                  <br />
                  <button
                    onClick={() => handleEditClick(product)}
                    style={{ marginRight: "8px" }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(product.id)}
                    style={{ color: "red" }}
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
