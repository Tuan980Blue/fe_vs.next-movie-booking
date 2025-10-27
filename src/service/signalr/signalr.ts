import * as signalR from '@microsoft/signalr'

const hubUrl = process.env.NEXT_SIGNALR_URL || 'http://localhost:5000/hubs/app'

let connection: signalR.HubConnection | null = null

export const startSignalR = () => {
    if (connection)
    {
        console.log("✅ SignalR pre connected")
        return connection
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl) // endpoint Hub bên .NET
        .withAutomaticReconnect()
        .build()

    // Khởi động kết nối
    const start = async () => {
        try {
            //Tránh connection.start() bị gọi song song
            if (connection?.state === signalR.HubConnectionState.Disconnected) {
                await connection.start();
                console.log("✅ SignalR state", connection.state);
            }
        } catch (err) {
            console.error("❌ SignalR connection failed:", err);
            setTimeout(start, 5000); // retry sau 5s nếu lỗi
        }
    };

    start();

    // Log lifecycle
    connection.onreconnected(() => console.log("♻️ SignalR reconnected"));
    connection.onclose(() => console.warn("⚠️ SignalR disconnected"));

    //Những event real-time cho toàn bộ client
    //ví dụ (sau này sửa)
    connection.on("notifies_updated", async () => {
        // const movies = await getMoviesApi();
        // dispatch(setMovies(movies.items));
    });

    return connection
}
