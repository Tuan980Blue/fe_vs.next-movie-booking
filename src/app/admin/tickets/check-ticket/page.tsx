import TicketScanner from "@/app/admin/tickets/_components/TicketScanner";

const CheckTicketPage = () => {
    return (
        <div>
            {/*tạo thêm nhiều thành phần UI để cho trang này nhân viên quản lý check in cho khách hàng đến để soát vé.*/}
            <TicketScanner/>
        </div>
    );
};

export default CheckTicketPage;