import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { backendApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export function LoginPage() {
  const { user, setSession } = useAppStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"learner-login" | "register" | "admin-login">("learner-login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ name: "Yash Tyagi", email: "", password: "" });

  if (user) return <Navigate to={user.role === "admin" ? "/app/admin" : "/app/dashboard"} replace />;

  async function submit() {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = mode === "register" ? await backendApi.register(form) : await backendApi.login({ email: form.email, password: form.password, expectedRole: mode === "admin-login" ? "admin" : "learner" });
      setSession(response.token, response.user);
      toast.success(`${response.user.role === "admin" ? "Admin" : "Learner"} login successful`);
      navigate(response.user.role === "admin" ? "/app/admin" : "/app/dashboard");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "Backend is not reachable. Start the server and check .env."
        : "Login/Register failed. Check backend and credentials.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-4 text-white">
      <Card className="w-full max-w-md">
        <div className="mb-6 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-fuchsia-400 text-zinc-950">
          <Shield />
        </div>
        <h1 className="text-2xl font-semibold">{mode === "admin-login" ? "Admin Login" : mode === "register" ? "Create learner account" : "Learner Login"}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {mode === "admin-login" ? "Senior/admin can only view learner progress tracking." : "Learners can save journals, tasks, quiz scores, and progress."}
        </p>
        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-white/[0.04] p-1 text-xs font-medium">
            {[
              ["learner-login", "Learner"],
              ["register", "Create"],
              ["admin-login", "Admin"]
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  setMode(id as "learner-login" | "register" | "admin-login");
                  setErrorMessage("");
                }}
                className={`rounded-md px-2 py-2 transition ${mode === id ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {mode === "register" && <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input" placeholder="Name" />}
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input" placeholder={mode === "admin-login" ? "Admin email" : "Email"} />
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="input" type="password" placeholder="Password" />
          {errorMessage && <div className="rounded-lg border border-rose-300/25 bg-rose-300/10 p-3 text-sm text-rose-100">{errorMessage}</div>}
          <Button className="w-full" onClick={submit} disabled={loading}>
            {mode === "register" ? <UserPlus size={17} /> : <Shield size={17} />} {loading ? "Please wait..." : mode === "admin-login" ? "Login as Admin" : mode === "register" ? "Create Learner Account" : "Login as Learner"}
          </Button>
          {mode === "admin-login" && <p className="text-center text-xs leading-5 text-zinc-500">Use the senior/admin email and password provided by the platform owner.</p>}
        </div>
      </Card>
    </main>
  );
}
