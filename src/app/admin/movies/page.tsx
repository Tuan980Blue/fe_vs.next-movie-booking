"use client";

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/reduxhooks'
import { fetchMovies } from '@/store/slices/moviesSlice'

export default function ManageMovies() {
    const dispatch = useAppDispatch()
    const { items, loading, error, page, pageSize, totalItems } = useAppSelector((s) => s.movies)

    useEffect(() => {
        dispatch(fetchMovies({ page: 1, pageSize:20 }))
    }, [dispatch, page, pageSize])

    console.log("Item Movies", items)

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Manage Movies</h1>
                <div className="text-sm text-gray-500">Total: {totalItems}</div>
            </div>

            {error && <div className="text-red-600">{error}</div>}
            {loading && <div>Loading...</div>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="text-left border-b">
                            <th className="p-2">Title</th>
                            <th className="p-2">Duration</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Release Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((m) => (
                            <tr key={m.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{m.title}</td>
                                <td className="p-2">{m.durationMinutes} min</td>
                                <td className="p-2">{m.status}</td>
                                <td className="p-2">{m.releaseDate ?? '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
