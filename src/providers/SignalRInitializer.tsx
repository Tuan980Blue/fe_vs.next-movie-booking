'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {startSignalR} from "@/service/signalr/signalr";

export default function SignalRInitializer({children}: { children: React.ReactNode }) {
    const dispatch = useDispatch()

    useEffect(() => {
        const connection = startSignalR(dispatch);

        return () => {
            connection?.stop();
        };
    }, [dispatch]);

    return children
}
