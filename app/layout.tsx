import "@/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "./components/navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Bibliothek",
  description: "Bibliothek der DHBW Stuttgart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
