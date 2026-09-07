import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

// Note: LayoutProps type might need an explicit import depending on your project setup, 
// or you can use the standard Next.js `{ children: React.ReactNode }` type.

export const metadata: Metadata = {
  title: "MCFS",
  description: "The Next Generation EMS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-full antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
