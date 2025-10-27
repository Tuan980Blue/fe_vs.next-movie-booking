import {useEffect, useCallback} from "react";
import {startSignalR} from "@/service/signalr/signalr";
import {AppDispatch} from "@/store/store";

/**
 * Hook lắng nghe SignalR group + event, tự động join/leave & rejoin khi reconnect.
 * @param dispath
 * @param groupName Tên group (VD: "genres")
 * @param eventName Tên event (VD: "genres_updated")
 * @param callback Hàm xử lý khi nhận event từ SignalR (handel function)
 */
export const useSignalRGroup = <T>(
    groupName: string,
    eventName: string,
    callback: (data: T) => void
) => {

    // Gói callback để không re-render thừa
    const handleEvent = useCallback(
        (data: T) => {
            callback(data);
        },
        [callback]
    );

    useEffect(() => {
        const connection = startSignalR();
        if (!connection) return;

        let joined = false;
        
        const joinGroup = async () => {
            if (joined){
                console.log("Group", groupName ,"pre joined")
                return
            }
            try {
                await connection.invoke("JoinGroup", groupName);
                joined = true
                console.log(`📡 Joined group: ${groupName}`);
            } catch (err) {
                console.error("❌ JoinGroup failed:", err);
            }
        };

        const leaveGroup = async () => {
            try {
                await connection.invoke("LeaveGroup", groupName);
                console.log(`🚪 Left group: ${groupName}`);
            } catch (err) {
                console.error("❌ LeaveGroup failed:", err);
            }
        };

        // Tham gia group khi mount
        joinGroup();

        // Gỡ listener cũ nếu có
        connection.off(eventName);
        // Đăng ký listener mới
        connection.on(eventName, handleEvent);

        // Khi reconnect thì join lại group
        connection.onreconnected(async () => {
            console.log("♻️ Reconnected, rejoining group...");
            await joinGroup();
        });

        // Cleanup khi unmount
        return () => {
            leaveGroup();
            connection.off(eventName, handleEvent);
        };
    }, [groupName, eventName]);
};
