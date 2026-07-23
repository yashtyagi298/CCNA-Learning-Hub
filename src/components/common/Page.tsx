import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageProps {
  title: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Page({ title, kicker, action, children }: PageProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {kicker && <p className="mb-2 text-sm font-medium text-cyan-300">{kicker}</p>}
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </motion.main>
  );
}
