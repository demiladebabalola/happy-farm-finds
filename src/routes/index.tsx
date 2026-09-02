import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { loginUser } from "@/lib/api";
import { IMG } from "@/lib/images";
import { dashboardPath, saveSession, type Role } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login | FarmDirect" },
      {
        name: "description",
        content:
          "Sign in to FarmDirect to browse local harvests, track orders and negotiate prices directly with verified farmers.",
      },
      { property: "og:title", content: "Login | FarmDirect" },
      {
        property: "og:description",
        content: "Sign in to FarmDirect and connect to local harvests near you.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setSelectedRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
      );
      const serverRole = saveSession(result?.token ?? result?.access_token, result?.user ?? result);
      navigate({ to: dashboardPath(serverRole) });
    } catch {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-margin-mobile md:p-gutter overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40">
        <img src={IMG.s7_1} className="w-full h-full object-cover" alt="Sunlit farmland" />
      </div>

      <main className="relative z-10 w-full max-w-[28rem] fade-in">
        <div className="flex flex-col items-center mb-lg text-center">
          <div className="w-16 h-16 bg-primary-container rounded-3xl flex items-center justify-center mb-4 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <span
              className="material-symbols-outlined text-on-primary text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">FarmDirect</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Connecting you to local harvests
          </p>
        </div>

        <div className="login-card bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <span className="block font-label-md text-label-md text-on-surface-variant">I am a...</span>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low border border-outline-variant rounded-2xl">
                {(["customer", "farmer"] as Role[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedRole(option)}
                    className={
                      role === option
                        ? "h-11 rounded-xl bg-primary text-on-primary font-label-md text-label-md capitalize transition-all"
                        : "h-11 rounded-xl text-on-surface-variant font-label-md text-label-md capitalize hover:bg-surface-container transition-all"
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-label-md text-label-md text-on-surface-variant"
              >
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue="demilade@farmdirect.ng"
                  placeholder="farmer@direct.com"
                  className="w-full h-[56px] pl-12 pr-4 bg-surface-container-low border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-label-md text-label-md text-on-surface-variant"
              >
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  defaultValue="harvest2026"
                  placeholder="••••••••"
                  className="w-full h-[56px] pl-12 pr-12 bg-surface-container-low border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer h-5 w-5 rounded-lg border-outline-variant text-primary focus:ring-primary transition-all"
                  />
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">Remember Me</span>
              </label>
              <Link
                to="/register"
                className="font-label-md text-label-md text-primary hover:underline underline-offset-4 decoration-2"
              >
                Forgot Password?
              </Link>
            </div>

            {error ? (
              <p className="font-body-md text-body-md text-error text-center" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] bg-primary-container text-on-primary font-label-md text-headline-md rounded-2xl shadow-lg shadow-primary-container/20 hover:bg-primary-container/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline underline-offset-4 transition-all"
            >
              Register
            </Link>
          </p>
        </div>

        <footer className="mt-12 flex justify-center gap-6 font-label-sm text-label-sm text-outline">
          <Link className="hover:text-primary transition-colors" to="/browse">
            Privacy Policy
          </Link>
          <span className="text-outline-variant">•</span>
          <Link className="hover:text-primary transition-colors" to="/browse">
            Terms of Service
          </Link>
          <span className="text-outline-variant">•</span>
          <Link className="hover:text-primary transition-colors" to="/browse">
            Help
          </Link>
        </footer>
      </main>
    </div>
  );
}
