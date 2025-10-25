import * as signalR from '@microsoft/signalr'
import {getMoviesApi} from "@/service";
import {setMovies} from "@/store/slices/movies";

const hubUrl = process.env.NEXT_SIGNALR_URL || 'http://localhost:5000/hubs/app'

let connection: signalR.HubConnection | null = null

export const startSignalR = (dispatch: any) => {
    if (connection)
    {
        console.log("✅ SignalR connected pre")
        return connection
    }

    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl) // endpoint Hub bên .NET
        .withAutomaticReconnect()
        .build()

    connection.start()
        .then(() => console.log('✅ SignalR connected'))
        .catch(err => console.error('❌ SignalR connection failed:', err))

    //Những event real-time cho toàn bộ client
    //ví dụ (sau này sửa)
    connection.on("notifies_updated", async () => {
        const movies = await getMoviesApi();
        dispatch(setMovies(movies.items));
    });

    return connection
}
