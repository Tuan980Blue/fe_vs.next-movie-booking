'use client'

import {useParams} from "next/navigation";
import {useEffect} from "react";

const TicketDetailManage = () => {
    const useParam = useParams();

    useEffect(() => {
        //fetch chi tiết ticket của user
    }, []);

    return (
        <div>

        </div>
    );
};

export default TicketDetailManage;