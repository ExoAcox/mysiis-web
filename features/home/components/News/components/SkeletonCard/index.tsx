import ContentLoader from "react-content-loader";

const SkeletonCard = () => {
    return (
        <div className="flex flex-col bg-white p-4 rounded-[0.625rem] shadow h-[15.625rem] border border-secondary-20 overflow-hidden">
            <ContentLoader uniqueKey="home-news" speed={2} viewBox="0 0 7500 6200" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                <rect x="0" y="0" rx="0" ry="0" width="7500" height="3000" />
                <rect x="0" y="3400" rx="0" ry="0" width="7500" height="1200" />
                <rect x="0" y="5000" rx="0" ry="0" width="7500" height="1200" />
            </ContentLoader>
        </div>
    );
};

export default SkeletonCard;
