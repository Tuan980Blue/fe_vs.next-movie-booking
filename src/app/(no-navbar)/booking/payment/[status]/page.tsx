import { notFound } from "next/navigation";
import { Suspense } from "react";
import PaymentStatusContent from "../_components/PaymentStatusContent";

type PageProps = {
    params: Promise<{
        status: string;
    }>;
};

const allowedStatuses = new Set(["success", "pending", "failed"]);

const PaymentStatusPageContent = ({ statusParam }: { statusParam: string }) => {
    return <PaymentStatusContent status={statusParam as "success" | "pending" | "failed"} />;
};

const SuspenseFallback = () => (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-10 text-white backdrop-blur-xl">
        <div className="h-6 w-32 rounded-full bg-white/10" />
        <div className="space-y-3">
            <div className="h-10 w-full rounded-2xl bg-white/5" />
            <div className="h-10 w-3/5 rounded-2xl bg-white/5" />
            <div className="h-10 w-2/5 rounded-2xl bg-white/5" />
        </div>
        <p className="text-sm text-white/60">Đang tải thông tin thanh toán...</p>
    </div>
);

const PaymentStatusPage = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const statusParam = resolvedParams.status?.toLowerCase();
    
    if (!statusParam || !allowedStatuses.has(statusParam)) {
        notFound();
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#06020e] via-[#0b0419] to-[#06020f] text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary-pink/30 blur-3xl" />
                <div className="absolute -bottom-16 left-24 h-64 w-64 rounded-full bg-primary-purple/25 blur-3xl" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent opacity-60" />
            </div>
            <div className="relative z-10 py-16 px-4 lg:px-8">
                <Suspense fallback={<SuspenseFallback />}>
                    <PaymentStatusPageContent statusParam={statusParam} />
                </Suspense>
            </div>
        </main>
    );
};

export default PaymentStatusPage;

