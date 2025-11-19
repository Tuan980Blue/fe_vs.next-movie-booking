import { Suspense } from "react";
import BookingDetail from "../_components/BookingDetail";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

const SuspenseFallback = () => (
    <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
        <p className="mt-4 text-neutral-darkGray/70">Đang tải chi tiết đặt vé...</p>
    </div>
);

export default async function BookingDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    return (
        <div className="py-8 px-4 lg:px-8 min-h-screen bg-white">
            <div className="mx-auto max-w-6xl">
                <Suspense fallback={<SuspenseFallback />}>
                    <BookingDetail bookingId={bookingId} />
                </Suspense>
            </div>
        </div>
    );
}

