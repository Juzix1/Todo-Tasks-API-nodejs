"use client";

import { Provider } from "react-redux";
import store from "../store/store";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>
          <div className="container">{children}</div>
        </body>
      </html>
    </Provider>
  );
}
