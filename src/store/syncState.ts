export function initBroadcastSync(store: any) {

    // 🔊 BroadcastChannel để đồng bộ giữa các tab
    const channel = new BroadcastChannel('redux_sync_channel');

    // Flag để tránh vòng lặp vô hạn khi nhận state từ tab khác
    let isReceivingFromOtherTab = false;
    let lastSyncTime = 0;

    // Khi state thay đổi, gửi state mới sang các tab khác
    store.subscribe(() => {
        console.log("Trạng thái isReceiving", isReceivingFromOtherTab)
        // Chỉ gửi nếu không phải đang nhận từ tab khác
        if (!isReceivingFromOtherTab) {
            const currentState = store.getState();
            const timestamp = Date.now(); //đại diện cho “thời điểm” state được gửi.

            channel.postMessage({
                type: 'STATE_SYNC',
                payload: currentState,
                timestamp: timestamp,
                syncKeys: ['movies', 'genres'] // Chỉ sync những slice này
            });

            console.log("Send message, log channel", channel);
        }
    });

    // Khi nhận được state từ tab khác → cập nhật
    channel.onmessage = (event) => {
        const {type, payload, timestamp} = event.data || {}

        console.log("Message event",event)
        if (type === 'STATE_SYNC' && timestamp > lastSyncTime) {
            isReceivingFromOtherTab = true
            lastSyncTime = timestamp  //gán time sau này tránh message cũ gửi đến lại.

            // Dispatch 1 action để các slice nhận dữ liệu mới
            store.dispatch({
                type: 'SYNC_FROM_OTHER_TAB',
                payload,
            })

            // Reset flag để không tạo vòng lặp
            setTimeout(() => {
                isReceivingFromOtherTab = false
            }, 100)
        }
    }

    // Cleanup khi tab đóng
    window.addEventListener('beforeunload', () => channel.close());
}