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

const PaymentStatusPage = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const statusParam = resolvedParams.status?.toLowerCase();
    
    if (!statusParam || !allowedStatuses.has(statusParam)) {
        notFound();
    }

    return (
        <Suspense fallback={<div className="min-h-screen py-8 px-4 lg:px-8">Đang tải thông tin thanh toán...</div>}>
            <PaymentStatusPageContent statusParam={statusParam} />
        </Suspense>
    );
};

export default PaymentStatusPage;

