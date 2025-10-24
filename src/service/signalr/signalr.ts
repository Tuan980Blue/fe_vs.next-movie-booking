import * as signalR from '@microsoft/signalr'
import {getGenresApi, getMoviesApi} from "@/service";
import {setGenres} from "@/store/slices/genres";
import {setMovies} from "@/store/slices/movies";

const hubUrl = process.env.NEXT_SIGNALR_URL || 'http://localhost:5000/hubs/app'

let connection: signalR.HubConnection | null = null

export const startSignalR = (dispatch: any) => {
    if (connection) return connection

    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl) // endpoint Hub bên .NET
        .withAutomaticReconnect()
        .build()

    connection.start()
        .then(() => console.log('✅ SignalR connected'))
        .catch(err => console.error('❌ SignalR connection failed:', err))


    //Lắng nghe các thay đổi để update state
    connection.on("genres_updated", async () => {
        const genres = await getGenresApi();
        dispatch(setGenres(genres));
    });
    connection.on("movies_updated", async () => {
        const movies = await getMoviesApi();
        dispatch(setMovies(movies.items));
    });

    return connection
}
