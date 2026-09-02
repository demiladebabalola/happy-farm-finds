import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { registerUser } from "@/lib/api";
import { IMG } from "@/lib/images";
import { dashboardPath, saveSession, type Role } from "@/lib/session";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Your Account | FarmDirect" },
      {
        name: "description",
        content:
          "Join FarmDirect as a customer or a farmer: list your harvest, buy fresh produce and negotiate prices directly.",
      },
      { property: "og:title", content: "Join FarmDirect" },
      {
        property: "og:description",
        content: "Register as a farmer or customer and start trading fresh produce directly.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [role, setSelectedRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirmPassword") ?? "")) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const location = String(form.get("address") ?? "");
      const result = await registerUser({
        name: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        password,
        role,
        ...(role === "farmer" ? { farm_name: String(form.get("fullName") ?? "") } : {}),
        ...(location ? { location } : {}),
      });
      const serverRole = saveSession(result?.token ?? result?.access_token, result?.user ?? result);
      navigate({ to: dashboardPath(serverRole) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const field =
    "w-full h-12 pl-10 pr-4 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg transition-all font-body-md text-body-md placeholder:text-outline-variant outline-none";

  return (
    <div className="bg-surface text-on-surface min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          className="w-full h-full object-cover object-bottom opacity-40"
          src={IMG.s6_1}
          alt="Green farmland at sunrise"
        />
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen px-margin-mobile py-xl">
        <div className="w-full max-w-[28rem] bg-surface-container-lowest rounded-xl shadow-[0px_12px_40px_rgba(0,0,0,0.08)] p-md flex flex-col gap-md border border-outline-variant/30 fade-in">
          <header className="text-center">
            <h1 className="font-headline-md text-headline-md-mobile text-primary mb-xs">Join FarmDirect</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Connecting local farmers to your table.
            </p>
          </header>

          <form className="flex flex-col gap-sm" onSubmit={handleRegister}>
            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  person
                </span>
                <input className={field} id="fullName" name="fullName" placeholder="Enter your full name" type="text" required />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">mail</span>
                <input className={field} id="email" name="email" placeholder="name@example.com" type="email" required />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">call</span>
                <input className={field} id="phone" name="phone" placeholder="+234 800 000 0000" type="tel" />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="address">
                Physical Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  location_on
                </span>
                <input className={field} id="address" name="address" placeholder="12 Farm Road, Kuje, Abuja" type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="role">
                I am a...
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                  diversity_3
                </span>
                <select
                  className="w-full h-12 pl-10 pr-4 bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg appearance-none transition-all font-body-md text-body-md outline-none"
                  id="role"
                  value={role}
                  onChange={(event) => setSelectedRole(event.target.value as Role)}
                >
                  <option value="customer">Consumer</option>
                  <option value="farmer">Farmer</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">lock</span>
                  <input
                    className={field.replace("pr-4", "pr-12")}
                    id="password" name="password"
                    placeholder="Create password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    className="absolute right-3 flex items-center justify-center p-1 hover:bg-surface-variant/30 rounded-full transition-colors"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface ml-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">
                    lock_reset
                  </span>
                  <input
                    className={field.replace("pr-4", "pr-12")}
                    id="confirmPassword" name="confirmPassword"
                    placeholder="Repeat password"
                    type={showConfirm ? "text" : "password"}
                    required
                  />
                  <button
                    className="absolute right-3 flex items-center justify-center p-1 hover:bg-surface-variant/30 rounded-full transition-colors"
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    <span className="material-symbols-outlined text-outline text-[20px]">
                      {showConfirm ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <p className="font-label-md text-label-md text-error text-center" role="alert">
                {error}
              </p>
            ) : null}

            <button
              className="mt-md w-full h-14 bg-primary text-on-primary font-label-md text-body-lg rounded-lg shadow-sm hover:bg-primary-container active:scale-95 transition-all duration-200 flex items-center justify-center gap-base disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <footer className="text-center pt-sm border-t border-outline-variant/20">
            <p className="font-label-md text-label-md text-on-surface-variant">
              Already have an account?{" "}
              <Link className="text-primary font-bold hover:underline" to="/">
                Login
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
