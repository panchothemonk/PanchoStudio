import "./globals.css";

export const metadata = {
  title: "Pancho Studio",
  description: "Premium Pancho profile-picture generator for Telegram, X, TikTok, and Instagram."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
