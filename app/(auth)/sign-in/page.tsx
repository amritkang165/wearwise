"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const { error } = await signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setLoading(false);
    if (error) setError(error.message ?? "Something went wrong");
    else router.push("/dashboard");
  };

  return (
    <>
      <h1 className="text-[22px] font-bold text-ink">Sign in</h1>
      <p className="mt-1.5 text-[14px] text-ash">
        Welcome back to WearWise.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[12px] font-medium text-ash">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-10 w-full rounded-[10px] border border-linen bg-paper px-3 text-[14px] text-ink placeholder:text-ash/40 focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-[12px] font-medium text-ash">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="h-10 w-full rounded-[10px] border border-linen bg-paper px-3 text-[14px] text-ink placeholder:text-ash/40 focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose/20"
          />
        </div>

        {error && (
          <p className="text-[13px] text-crimson">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-10 w-full rounded-[10px] bg-rose text-[14px] font-semibold text-paper transition-colors hover:bg-crimson disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ash">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-rose hover:text-crimson">
          Sign up
        </Link>
      </p>
    </>
  );
}
