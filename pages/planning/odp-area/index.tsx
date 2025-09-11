import { useRouter } from "next/router";
import { useEffect } from "react";

export interface OdpAreaProps {
    user: User;
    device: Device
}

const OdpArea = () => {
    const route = useRouter()

    useEffect(() => {
        route.replace('/planning/odp-area/odp-summary')
    }, [])

    return null;
};


export default OdpArea;

