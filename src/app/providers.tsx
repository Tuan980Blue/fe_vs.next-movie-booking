"use client";

import { AuthProvider } from "@/context/AuthContext";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import {useEffect} from "react";
import {initBroadcastSync} from "@/store/syncState";

export default function AppProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        //Thiết lập kênh BroadcastChannel, lắng nghe và gửi message giữa tab
        initBroadcastSync(store);
    }, []);

    return (
      <Provider store={store}>
          <AuthProvider>
              {children}
          </AuthProvider>
      </Provider>
  );
}


