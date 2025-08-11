"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api"; // This should have baseURL: 'http://localhost:3001'
import { User } from "../../types";  // Make sure you have id, name, email in the type
import Link from "next/dist/client/link";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Link href="/">Back to Home</Link>
      <h1>👥 Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Name</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Email</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "0.5rem 0" }}>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
