import Link from "next/link";


export default function Home() {
  return (
    <main  >
       <h1 className="text-3xl font-bold">Welcome to Reload Ops</h1>

      <div className="space-y-2" style={{ padding: "20px", backgroundColor: "#f9f9f9", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link href="auth/login" className="text-blue-500 underline">Login</Link>
        <Link href="auth/register" className="text-blue-500 underline">Register</Link>
        <Link href="/products" className="text-blue-500 underline">View Products</Link>
        <Link href="/users" className="text-blue-500 underline">View Users</Link>
      </div>
    </main>
  );
}
