'use client'

import { useEffect } from 'react'
import {startSignalR} from "@/service/signalr/signalr";

export default function SignalRInitializer({children}: { children: React.ReactNode }) {

    useEffect(() => {
        const connection = startSignalR();

        return () => {
            connection?.stop();
        };
    }, []);

    return children
}
