"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <NextThemesProvider {...themeProps} forcedTheme="light">
          <Toaster />

          {/* Your app */}
          {children}

          {/* Floating WhatsApp Button */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-4 right-4 w-16 h-16 rounded-full 
                        bg-gradient-to-br from-green-400 to-green-600 
                        shadow-lg shadow-green-500/50 
                        flex items-center justify-center cursor-pointer z-50"
              onClick={() => router.push("/contact")}
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 animate-ping" />

              <FaWhatsapp size={32} className="text-white relative z-10" />
            </motion.div>
        </NextThemesProvider>

        <h1>{theme}</h1>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
