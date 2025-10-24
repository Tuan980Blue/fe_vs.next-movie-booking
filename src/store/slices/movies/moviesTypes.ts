import {MovieResponse, MovieSearchParams} from "@/models";

export interface MoviesState {
    items: MovieResponse[]
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    loading: boolean
    error: string | null
    lastQuery: MovieSearchParams | null  //Lưu lại bộ lọc cuối cùng (vd: thể loại, tên phim, trang, etc.), sau này refresh truyền vào.
    stats: {
        totalMovies: number
        draftMovies: number
        comingSoonMovies: number
        nowShowingMovies: number
        archivedMovies: number
    } | null
    selectedMovie: MovieResponse | null
}