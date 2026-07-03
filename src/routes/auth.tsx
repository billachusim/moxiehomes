import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import logo from "@/assets/moxie-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Moxie Homes & Properties" },
      { name: "description", content: "Sign in or create your Moxie Homes account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Account created! You can now sign in.");
        setMode("signin");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back!");
        navigate({ to: "/admin" });
      }
    }
    setLoading(false);
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
    if (!result.redirected && !result.error) navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-navy p-12 text-navy-foreground">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Moxie" className="h-10" />
          <span className="font-serif text-lg">Moxie Homes</span>
        </Link>
        <div>
          <h2 className="font-serif text-4xl">Utmost trust and credibility<br /><span className="italic text-gold">in real estate.</span></h2>
          <p className="mt-4 max-w-md text-white/70">Manage your favorites, inquiries, and account — all in one place.</p>
        </div>
        <div className="text-xs text-white/40">© {new Date().getFullYear()} Moxie Homes And Properties Ltd</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="md:hidden flex items-center gap-3 mb-8">
            <img src={logo.url} alt="Moxie" className="h-10" />
          </Link>
          <h1 className="font-serif text-4xl text-navy">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to your Moxie Homes account." : "Join Moxie Homes to save listings and track inquiries."}
          </p>

          <button onClick={onGoogle} className="mt-8 w-full flex items-center justify-center gap-3 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-secondary">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
            )}
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold" />
            <button disabled={loading} className="w-full rounded-md bg-navy py-3 text-sm font-medium text-navy-foreground hover:bg-navy/90 disabled:opacity-60">
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-navy font-medium hover:text-gold">Sign up</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-navy font-medium hover:text-gold">Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
