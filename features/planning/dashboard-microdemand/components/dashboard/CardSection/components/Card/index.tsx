import { StaticImageData } from "next/image";
import { Else, If, Then } from "react-if";

import { Container } from "@features/planning/dashboard-microdemand/components/global";

import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Title } from "@components/text";

interface Props {
    label: string;
    value: number;
    icon?: StaticImageData;
    loading: boolean;
}

const Card: React.FC<Props> = ({ label, value, icon, loading }) => {
    return (
        <Container key={label} className="flex items-center flex-1 gap-4 px-8 sm:p-3">
            {icon && <Image src={icon} />}

            <div>
                <Title tag="span" mSize="medium" size="h4">
                    {label}
                </Title>
                <If condition={loading}>
                    <Then>
                        <Spinner className="py-2.5" />
                    </Then>
                    <Else>
                        <Title tag="span" mSize="h4" size="h2">
                            {value}
                        </Title>
                    </Else>
                </If>
            </div>
        </Container>
    );
};

export default Card;
