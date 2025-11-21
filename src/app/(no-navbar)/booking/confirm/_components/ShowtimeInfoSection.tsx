"use client"

interface ShowtimeInfoSectionProps {
    movieTitle?: string;
    formattedShowtime: string;
    roomName?: string;
    seatNames: string;
}

export default function ShowtimeInfoSection({
    movieTitle,
    formattedShowtime,
    roomName,
    seatNames,
}: ShowtimeInfoSectionProps) {
    return (
        <section className="space-y-1">
            <p className="text-sm font-semibold text-neutral-darkGray">Thông tin vé</p>
            <div className="rounded-xl border border-neutral-lightGray/40 bg-neutral-lightGray/5 p-4 text-sm text-neutral-darkGray space-y-1">
                <div className="text-lg font-bold text-neutral-black">{movieTitle}</div>
                <div>{formattedShowtime}</div>
                <div>Phòng chiếu: {roomName || '-'}</div>
                <div>Ghế đã chọn: <span className="font-semibold">{seatNames || '-'}</span></div>
            </div>
        </section>
    );
}

