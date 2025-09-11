/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";
import { useEffect } from "react";

import { tw } from "@functions/style";

interface Props {
    onInit: () => void;
    mapRef: React.RefObject<HTMLDivElement>;
    apiKey?: string;
    state?: object;
    className?: string;
}

const GoogleMap = ({ apiKey, mapRef, state, onInit, className }: Props) => {
    useEffect(() => {
        const interval = setInterval(() => {
            if ((window as any).google) {
                clearInterval(interval as any);
                onInit();
            }
        }, 500);
    }, []);

    return (
        <>
            <Script
                id={apiKey ?? process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
                type="text/javascript"
                src={`https://maps.googleapis.com/maps/api/js?key=${apiKey ?? process.env.NEXT_PUBLIC_GOOGLE_API_KEY
                    }&region=ID&language=id&libraries=places,geometry,visualization,drawing`}
                strategy="afterInteractive"
            />
            <div ref={mapRef} id="maps-container" className={tw("w-full h-full", className)} {...state} />
        </>
    );
};

export default GoogleMap;
