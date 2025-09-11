import { StaticImageData } from "next/image";
import { Else, If, Then, When } from "react-if";
import { FaEdit } from "react-icons/fa";

import { Container } from "@features/planning/dashboard-microdemand/components/global";

import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Title } from "@components/text";
import { formatThousands, intersection } from "@functions/common";
import useProfile from "@hooks/useProfile";

interface Props {
    label: string;
    value: number;
    icon?: StaticImageData;
    loading: boolean;
    isUpdate?: boolean;
    access: string[];
    onUpdate?: () => void;
}

const Card: React.FC<Props> = ({ label, value, icon, loading, isUpdate, access = [], onUpdate }) => {
    const profile = useProfile();    
    const roles: [] = profile?.role_keys;    

    return (
        <Container key={label} className="flex items-center flex-1 gap-4 px-4 sm:p-3">
            {icon && <Image src={icon} />}
            <div className="w-full flex items-center justify-between">
                <div>
                    <Title tag="span" mSize="medium" size="medium">
                        {label}
                    </Title>
                    <If condition={loading}>
                        <Then>
                            <Spinner className="py-2.5" />
                        </Then>
                        <Else>
                            <div className="flex items-center justify-between">
                                <Title tag="span" mSize="h4" size="h2">
                                    {formatThousands(value)}
                                </Title>
                            </div>
                        </Else>
                    </If>
                </div>
                <When condition={intersection(roles, access).length}>
                    {isUpdate && (
                        <FaEdit 
                            title="update-status" 
                            className="cursor-pointer" 
                            size={30} 
                            color="red" 
                            onClick={onUpdate}
                        />
                    )}
                </When>
            </div>
        </Container>
    );
};

export default Card;
