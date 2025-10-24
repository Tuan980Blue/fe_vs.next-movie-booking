import {GenreResponse} from "@/models";

export interface GenresState {
    items: GenreResponse[]
    loading: boolean
    error: string | null
    selectedGenre: GenreResponse | null
    searchKeyword: string
}