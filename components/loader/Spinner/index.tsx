import { SpinnerCircular } from "spinners-react";
import "spinners-react/lib/SpinnerCircular.css";

import { tw } from "@functions/style";

interface Props {
    size?: number | string;
    thickness?: number;
    color?: string;
    secondaryColor?: string;
    className?: string;
}

const Spinner: React.FC<Props> = ({ size, thickness, color, secondaryColor, className }) => {
    return (
        <div className={tw(`flex items-center justify-center w-full`, className)}>
            <SpinnerCircular color={color} secondaryColor={secondaryColor} size={size} thickness={thickness} />
        </div>
    );
};

Spinner.defaultProps = {
    size: "2rem",
    thickness: 250,
    color: "#EE3124",
    secondaryColor: "rgba(0,0,0,0.1)",
};

export default Spinner;
