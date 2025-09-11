import { tw } from "@functions/style";

interface Props {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    className?: string;
}

const RadiusSlider: React.FC<Props> = ({ value, min, max, step, onChange, className }) => {
    return (
        <div className={tw("flex flex-col gap-2.5 font-bold text-black-100 text-medium", className)}>
            <span>Radius: {value}</span>
            <input
                data-testid="slider"
                type="range"
                className="w-full input-range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
};

export default RadiusSlider;
