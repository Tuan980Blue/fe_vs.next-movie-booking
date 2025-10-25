import {getMoviesApi} from "@/service";
import {AppDispatch} from "@/store/store";
import {setMovies} from "@/store/slices/movies";

export const handleMoviesUpdated = async (dispatch: AppDispatch) => {
    try {
        const movies = await getMoviesApi();
        dispatch(setMovies(movies.items));
        console.log("✅ Genres updated via SignalR");
    } catch (err) {
        console.error("❌ Failed to update genres:", err);
    }
};
