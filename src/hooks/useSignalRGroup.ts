
import {useEffect} from "react";
import {startSignalR} from "@/service/signalr/signalr";
import {AppDispatch} from "@/store/store";

type Callback<T> = (data: T) => void;

export const useSignalRGroup = <T>(
    dispatch: AppDispatch,
    groupName: string,
    eventName: string,
    callback: Callback<T>
) => {
    useEffect(() => {
        const connection = startSignalR(dispatch);

        // Tham gia group
        connection.invoke('JoinGroup', groupName).catch(err => console.error(err));

        // Lắng nghe event
        connection.on(eventName, callback);

        return () => {
            // Cleanup: rời group + remove event listener
            connection.invoke('LeaveGroup', groupName).catch(err => console.error(err));
            connection.off(eventName);
        };
    }, [dispatch, groupName, eventName, callback]);
};

//Tham gia group và lắng nghe sự kiện
// useSignalRGroup(dispatch, 'genres', 'genres_updated', () => handleGenresUpdated(dispatch));