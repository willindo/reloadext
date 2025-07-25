'use client';

import { useState } from 'react';
import { login } from '../../lib/auth';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const token = res.data.access_token;
      localStorage.setItem('token', token); // Store JWT
      console.log('Login successful:', token);
      router.push('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔐 Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
