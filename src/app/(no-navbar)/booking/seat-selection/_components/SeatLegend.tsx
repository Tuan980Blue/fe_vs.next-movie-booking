"use client";

type SeatLegendProps = {
    seatLegend: Array<{ type: string; color: string; label?: string }>;
};

export default function SeatLegend({ seatLegend }: SeatLegendProps) {
    const defaultLegend = [
        { label: "Ghế có thể đặt", color: "#9CA3AF", bg: "bg-neutral-lightGray" },
        { label: "Ghế đang chọn", color: "#FACC15", bg: "bg-accent-yellow" },
        { label: "Ghế đang có người chọn", color: "#22C55E", bg: "bg-green-500" },
        { label: "Ghế đã có người đặt", color: "#EF4444", bg: "bg-accent-red" },
        { label: "Ghế không thể đặt", color: "#1F2937", bg: "bg-neutral-darkGray" },
    ];

    return (
        <div className="rounded-lg border border-neutral-lightGray/40 bg-white p-3 shadow-sm">
            <div className="text-xs font-bold text-neutral-darkGray mb-3 flex items-center gap-1.5">
                <span className="text-base">🎫</span>
                <span>Chú thích</span>
            </div>
            <div className="space-y-2 text-xs text-neutral-darkGray">
                {defaultLegend.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span
                            className={`w-5 h-5 rounded border border-neutral-lightGray/50 ${item.bg} inline-block shrink-0`}
                        />
                        <span className="text-xs leading-tight">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

