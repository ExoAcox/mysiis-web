import ContentLoader from "react-content-loader";

const SkeletonNewsDetail = () => {
    return (
        <div>
            <ContentLoader uniqueKey="detail-news" speed={2} viewBox="0 0 7500 6200" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                <rect x="0" y="0" rx="0" ry="0" width="7500" height="1200" />
                <rect x="0" y="1300" rx="0" ry="0" width="7500" height="3000" />
                <rect x="0" y="4600" rx="0" ry="0" width="7500" height="400" />
                <rect x="0" y="5100" rx="0" ry="0" width="7500" height="400" />
                <rect x="0" y="5600" rx="0" ry="0" width="7500" height="400" />
            </ContentLoader>
        </div>
    );
};

export default SkeletonNewsDetail;
