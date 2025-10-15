"use client";

import { AuthProvider } from "@/context/AuthContext";
import {Provider} from "react-redux";
import {store} from "@/store/store";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
      <Provider store={store}>
          <AuthProvider>
              {children}
          </AuthProvider>
      </Provider>
  );
}


