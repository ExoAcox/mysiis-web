import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { When } from "react-if";

import queryClient from "@libs/react-query";

import { getNps, submitNps } from "@api/nps";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";

import { Default, Reason, Success } from "./components";

const NpsModal: React.FC<{ user?: User }> = ({ user }) => {
    const { modal, setModal } = useModal("nps");

    const [status, setStatus] = useState("default");
    const [rate, setRate] = useState<string | undefined>(undefined);
    const [reason, setReason] = useState("");

    const nps = useQuery({
        queryKey: ["/nps/getNps"],
        queryFn: () =>
            getNps({
                userId: user!.userId,
                settingId: process.env.NEXT_PUBLIC_NPS_SETTING_ID,
                days: 30,
            }),

        enabled: !!user?.userId,
        staleTime: Infinity,
    });

    const submit = useMutation({
        mutationFn: () =>
            submitNps({
                settingId: process.env.NEXT_PUBLIC_NPS_SETTING_ID,
                ratingId: rate!,
                userId: user!.userId,
                comment: reason,
            }),
        onSettled: () => {
            setStatus("success");

            queryClient.setQueryData(["/nps/getNps"], { ...nps.data, show_nps: false });
        },
    });

    const onSubmit = () => {
        submit.mutate();
    };

    useEffect(() => {
        if (nps.data?.show_nps) {
            const expiredNps = window.localStorage.getItem("hidden-nps-modal");
            if (expiredNps) {
                if (dayjs().isAfter(dayjs(expiredNps))) setModal(true);
            } else {
                setModal(true);
            }
        }
    }, [nps.data]);

    return (
        <Modal
            visible={modal}
            className="max-w-[37.5rem] sm:max-w-full"
            onClose={() => {
                setStatus("default");
                setRate(undefined);
                setReason("");
                window.localStorage.setItem("hidden-nps-modal", dayjs().add(1, "month").format("YYYY/MM/DD"));
            }}
        >
            <When condition={status !== "success"}>
                <MdClose className="w-6 h-6 ml-auto cursor-pointer hover:fill-primary-40" onClick={() => setModal(false)} />
            </When>
            <When condition={status === "default"}>
                <Default ratings={nps.data?.ratings || []} rate={rate} setRate={setRate} setStatus={setStatus} loading={nps.isPending} />
            </When>
            <When condition={status === "reason"}>
                <Reason reason={reason} setReason={setReason} onSubmit={onSubmit} loading={submit.isPending} />
            </When>
            <When condition={status === "success"}>
                <Success close={() => setModal(false)} />
            </When>
        </Modal>
    );
};

export default NpsModal;
