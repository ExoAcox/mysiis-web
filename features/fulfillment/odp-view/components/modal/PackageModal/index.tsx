import { useQuery } from "@tanstack/react-query";
import { Else, If, Then } from "react-if";

import { GetPackage, Package, getPackage } from "@api/odp";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Spinner } from "@components/loader";
import { ModalTitle } from "@components/text";

const PackageModal = () => {
    const { modal, setModal, data } = useModal<GetPackage>("odp-view/package");

    const packages = useQuery({
        queryKey: ["odp/getPackage", data],
        queryFn: () => getPackage(data),
        enabled: !!data.deviceId,
    });

    return (
        <Modal visible={modal}>
            <ModalTitle onClose={() => setModal(false)}>Detail Package</ModalTitle>
            <If condition={packages.isPending}>
                <Then>
                    <Spinner className="mt-8 mb-7" />
                </Then>
                <Else>
                    <div className="flex flex-col gap-4 mt-4">
                        {packages.data?.map((packageXml) => {
                            return packageXml.packageXml.map((packageItem) => {
                                return <List packageItem={packageItem} key={packageItem.TIPE_PAKET} />;
                            });
                        })}
                    </div>
                </Else>
            </If>
        </Modal>
    );
};

const List: React.FC<{ packageItem: Package }> = ({ packageItem }) => {
    return (
        <div className="flex gap-4 text-black-90 max-w-[31.25rem]">
            <div className="flex flex-col items-center px-3 py-2 text-white rounded bg-primary-40 h-fit">
                <label className="font-bold text-large">{Number(packageItem.SPEED) / 1000}</label>
                <span className="text-caption">MBPS</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-medium">{packageItem.TIPE_PAKET}</span>
                <span className="text-small">{packageItem.FLAG}</span>
            </div>
        </div>
    );
};

export default PackageModal;
