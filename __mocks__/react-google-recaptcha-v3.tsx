import React from "react";

export const GoogleReCaptchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

export const useGoogleReCaptcha = () => {
    return {
        executeRecaptcha: () => Promise.resolve("token"),
    };
};
