import { getGenresApi } from "@/service";
import { setGenres } from "@/store/slices/genres/genresSlice";
import {AppDispatch} from "@/store/store";

export const handleGenresUpdated = async (dispatch: AppDispatch) => {
    try {
        const genres = await getGenresApi();
        dispatch(setGenres(genres));
        console.log("✅ Genres updated via SignalR");
    } catch (err) {
        console.error("❌ Failed to update genres:", err);
    }
};
