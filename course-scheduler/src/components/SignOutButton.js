"use client";

export default function SignOutButton() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-400 px-3 py-1 rounded-md transition-all duration-200 hover:text-red-300"
    >
      Sign Out
    </button>
  );
}