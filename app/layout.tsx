import type { Metadata } from "next";
import { Bell } from "lucide-react";
import AppHeader from "./components/AppHeader";
import SidebarNav from "./components/SidebarNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXO",
  description: "Panel central para administrar tu homelab y Proxmox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <div className="app-shell lg:grid lg:min-h-screen lg:grid-cols-[272px_minmax(0,1fr)]">
          <aside className="border-b border-white/8 bg-[#141414] px-4 py-4 lg:border-b-0 lg:border-r lg:border-r-white/8 lg:px-4 lg:py-5">
            <div className="panel-strong rounded-[20px] p-4">
              <div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.3em] text-zinc-500">
                    NEXO
                  </p>
                  <h1 className="mt-1.5 text-lg font-semibold text-zinc-100">
                    Control del homelab
                  </h1>
                </div>
              </div>
            </div>
            <SidebarNav />
          </aside>

          <div className="min-w-0 px-4 py-4 lg:px-5 lg:py-5">
            <div className="panel rounded-[20px] px-4 py-4 lg:px-5">
              <header className="flex flex-col gap-4 border-b border-white/8 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <AppHeader />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-300 transition hover:bg-[#202020] hover:text-zinc-100"
                    >
                      <Bell className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#161616] px-3 py-2">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#2a2a2a] text-sm font-semibold text-zinc-100">
                        PA
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">Lalo</p>
                        <p className="text-xs text-zinc-500">Admin principal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <main className="pt-6">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
