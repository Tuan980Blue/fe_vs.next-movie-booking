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
    <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-neutral-lightGray/40 bg-white p-10 text-neutral-darkGray shadow-xl">
        <div className="h-6 w-32 rounded-full bg-neutral-lightGray/20" />
        <div className="space-y-3">
            <div className="h-10 w-full rounded-xl bg-neutral-lightGray/10" />
            <div className="h-10 w-3/5 rounded-xl bg-neutral-lightGray/10" />
            <div className="h-10 w-2/5 rounded-xl bg-neutral-lightGray/10" />
        </div>
        <p className="text-sm text-neutral-darkGray/70">Đang tải thông tin thanh toán...</p>
    </div>
);

const PaymentStatusPage = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const statusParam = resolvedParams.status?.toLowerCase();
    
    if (!statusParam || !allowedStatuses.has(statusParam)) {
        notFound();
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-white">
            <div className="relative z-10 py-8 px-4 lg:px-8">
                <Suspense fallback={<SuspenseFallback />}>
                    <PaymentStatusPageContent statusParam={statusParam} />
                </Suspense>
            </div>
        </main>
    );
};

export default PaymentStatusPage;

