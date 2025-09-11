import { tw } from '@functions/style';

interface LineProps {
    className?: string;
}

const Line: React.FC<LineProps> = ({ className }) => {
    return <div className={tw("h-[1px] w-full bg-black-60", className)} />;
}

export default Line;
