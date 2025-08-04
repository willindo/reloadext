import Link from "next/dist/client/link";


export default function Home() {
  return (
    <main  >
       <h1 className="text-3xl font-bold">Welcome to Reload Ops</h1>

      <div className="space-y-2">
        <Link href="/login" className="text-blue-500 underline">Login</Link>
        <Link href="/register" className="text-blue-500 underline">Register</Link>
        <Link href="/products" className="text-blue-500 underline">View Products</Link>
      </div>
    </main>
  );
}
