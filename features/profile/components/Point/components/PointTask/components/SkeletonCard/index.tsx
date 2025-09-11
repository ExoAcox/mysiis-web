import ContentLoader from "react-content-loader";

const SkeletonCard = () => {
    return (
        <div className="flex flex-col gap-4 p-4 rounded-md shadow bg-white overflow-hidden">
            <ContentLoader uniqueKey="profile-point" speed={2} viewBox="0 0 1000 200" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                <rect x="0" y="0" rx="4" ry="4" width="200" height="200" />
                <rect x="250" y="30" rx="4" ry="4" width="750" height="50" />
                <rect x="250" y="120" rx="4" ry="4" width="750" height="50" />
            </ContentLoader>
        </div>
    );
};

export default SkeletonCard;
