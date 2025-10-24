"use client";

import { AuthProvider } from "@/providers/AuthContext";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import SignalRInitializer from "@/providers/SignalRInitializer";

export default function AppProviders({ children }: { children: React.ReactNode }) {

    return (
      <Provider store={store}>
          <SignalRInitializer>
              <AuthProvider>
                  {children}
              </AuthProvider>
          </SignalRInitializer>
      </Provider>
  );
}


