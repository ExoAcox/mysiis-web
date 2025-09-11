import React, { useEffect } from "react";

export const Line = () => {
    return <canvas />;
};

interface Props {
    options?: any;
}

export const Bar = ({ options }: Props) => {
    useEffect(() => {
        if (options?.plugins?.tooltip?.external) {
            options?.plugins?.tooltip?.external({
                tooltip: {
                    caretX: 0,
                    dataPoints: [
                        {
                            label: "label",
                            datasetIndex: 0,
                            dataIndex: 0,
                        },
                    ],
                    body: true,
                },
                chart: {
                    canvas: {
                        getBoundingClientRect: (left: number) => (left = 0),
                        offsetWidth: 0,
                    },
                },
            });
        }
    }, []);

    return <canvas />;
};
