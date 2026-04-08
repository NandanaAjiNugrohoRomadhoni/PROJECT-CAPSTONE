"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLogin = () => {
    // sementara dummy login dulu
    if (form.username === "admin") {
      router.push("/super-admin");
    } else if (form.username === "gudang") {
      router.push("/gudang");
    } else {
      router.push("/gizi");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-80 p-6 bg-white rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}