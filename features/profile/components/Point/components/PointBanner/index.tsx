import Banner from "./Banner";

const PointBanner: React.FC = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-full h-full overflow-hidden">
                <Banner />
            </div>
        </div>
    );
};

export default PointBanner;
