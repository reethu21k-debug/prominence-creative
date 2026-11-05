"use client";
import { useActionState } from "react";
import { signIn, type LoginState } from "../actions";

const initial: LoginState = {};
const input =
  "w-full border-0 border-b border-line bg-transparent py-3 text-base text-white placeholder:text-muted transition-colors focus:border-white focus:outline-none";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  return (
    <form action={action} className="space-y-8" noValidate>
      <div>
        <label htmlFor="email" className="micro block">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className={`${input} mt-1`} />
      </div>
      <div>
        <label htmlFor="password" className="micro block">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={`${input} mt-1`} />
      </div>
      {state.error && <p role="alert" className="border border-line p-4 text-sm text-white">{state.error}</p>}
      <button
        type="submit" disabled={pending}
        className="inline-flex w-full items-center justify-center bg-white px-8 py-5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-fg-2 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
