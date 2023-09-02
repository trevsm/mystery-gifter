import { Nunito } from "next/font/google";
import { Providers } from "./Providers";
import "./main.css";

export const font = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
