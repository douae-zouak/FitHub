import { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <CartProvider>
          {children}
          <div>
            <Toaster />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
