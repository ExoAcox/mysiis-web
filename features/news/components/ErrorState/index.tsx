import emptyStateImage from "@images/bitmap/empty_state.png";

import { Image } from "@components/layout";
import { Subtitle, Title } from "@components/text";

interface ErrorStateProps {
    title: string;
    description: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, description }) => {
    return (
        <div className="py-8 text-center">
            <Image src={emptyStateImage} width={288} height={200} />
            <Title className="mt-4 mb-2 text-2xl font-extrabold">{title}</Title>
            <Subtitle size="subtitle" className="text-black-80">
                {description}
            </Subtitle>
        </div>
    );
};

export default ErrorState;
