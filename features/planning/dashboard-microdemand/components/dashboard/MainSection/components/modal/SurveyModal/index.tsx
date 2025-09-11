import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useEffect, useState } from "react";
import { ImMap } from "react-icons/im";
import { Case, Else, If, Switch, Then, When } from "react-if";
import ImageFuture from "next/image";

import { Respondent, RespondentWithResponse, ResponseGroups, getRespondentWithResponse } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";

import { intersection } from "@functions/common";

import { useConfig } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Spinner } from "@components/loader";
import { ModalTitle, Title } from "@components/text";
import { Tabs } from "../../../components";
import ListItem from "@features/planning/odp-area/components/ListItem";

dayjs.extend(isBetween);

const RowDataResponden: React.FC<{ label: string, value: string, type: string }> = ({ label, value, type }) => {
    let checkboxValue = "";
    let imageValue: string[] = [];

    if (type === 'checkbox') {
        const parsed = JSON.parse(value).join(", ");
        checkboxValue = parsed;
    }
    
    if (type === 'image') {
        const parsed = JSON.parse(value);
        // const finalParsed = JSON.parse(parsed);
        parsed.forEach((element: string) => {
            imageValue.push(element);
        });
    }
    
    return (
        <div>
            <If condition={type === 'image'}>
                <Then>
                    <div className="flex flex-col gap">
                        <div>{label}</div>
                        <div className="flex flex-row flex-wrap gap-3">
                            {imageValue.map((item, index) => {
                                return (
                                    <ImageFuture 
                                        className="rounded-md border-2 border-gray-300 overflow-hidden object-contain"
                                        key={index} 
                                        src={String(item)} 
                                        alt={label} 
                                        unoptimized 
                                        quality={100} 
                                        width={140} 
                                        height={140}
                                    /> 
                                )
                            })}
                        </div>
                    </div>
                </Then>
                <Else>
                    <If condition={type === 'checkbox'}>
                        <Then>
                            <div className="flex flex-col gap">
                                <div>{label}</div>
                                <div className="font-bold italic">{checkboxValue}</div>
                            </div>
                        </Then>
                        <Else>
                            <div className="flex flex-col gap">
                                <div>{label}</div>
                                <div className="font-bold italic">{value}</div>
                            </div>
                        </Else>
                    </If>
                </Else>
            </If>
        </div>
    );
};

const DetailResponses: React.FC<{ data: RespondentWithResponse | undefined; sectionId: number }> = ({ data, sectionId }) => {
    const [lists, setLists] = useState<ResponseGroups[]>([]);

    useEffect(() => {
        if (data && sectionId) {
            if (data.responses.lists.length > 0) {
                const responses = data.responses.lists.find((item) => item.id === sectionId);
                if(responses){
                    setLists(responses.groups);
                }
            }

        }
    }, [data, sectionId]);

    return (
        <When condition={lists.length > 0}>
            <div className="max-h-[300px] overflow-y-auto flex flex-col gap-3 mt-4">
                {lists.map((group) => {
                    return (
                        <div key={group.id}>
                            <Title size="large" className="text-gray-400">{"- " + group.label}</Title>
                            <div className="flex flex-col gap-2">
                            {group.responses.map((item) => {
                                return (
                                    <RowDataResponden
                                        key={item.id}
                                        type={item.question_type} 
                                        label={item.question_label}
                                        value={item.question_type === "image" ? JSON.stringify(item.value) : item.value}
                                    />
                                )
                            })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </When>
    );
};

const SurveyModal: React.FC<{ user: User }> = ({ user }) => {
    const survey = useModal<Respondent>("dashboard-survey-default");
    const maps = useModal<Respondent>("dashboard-survey-maps");
    const validate = useModal<Respondent>("dashboard-survey-validate");
    const reject = useModal<Respondent>("dashboard-survey-reject");

    const [respondentWithResponse, setRespondentWithResponse] = useState<RespondentWithResponse | undefined>(undefined);
    const [tabOptions, setTabOptions] = useState<{ label: string; value: string }[]>([]);
    const [sectionId, setSectionId] = useState<number>(0);

    const { data } = survey;
    
    const configStart = useConfig(15);
    const configEnd = useConfig(16);

    const closeModal = () => {
        survey.setModal(false);
    };

    const handleDecline = () => {
        reject.setData(data);
    };

    const handleValidate = () => {
        validate.setData(data);
    };

    const handleSeeOnTheMaps = () => {
        maps.setData(data);
    };

    useEffect(() => {
        if (survey.modal && data.id) {
            getRespondentWithResponse(Number(data.id))
            .then((res) => {
                setRespondentWithResponse(res);
                const options = res.responses.lists.map(item => {
                    return {
                        label: item.section,
                        value: String(item.id)
                    }
                })
                // options.push({ label: "Maps", value: "9" });
                options.sort((a, b) => a.value.localeCompare(b.value));
                setTabOptions(options);
                setSectionId(parseInt(options[0]["value"]))
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [survey.modal]);

    return (
        <Modal
            className="w-[50%] sm:w-full max-h-[90%] overflow-y-auto"
            visible={survey.modal}
        >
            <ModalTitle onClose={closeModal}>Detail Responden</ModalTitle>
            <div className="flex flex-col gap-2 mt-4">
                <div>
                    <a
                        href={`http://maps.google.com/?cbll=${data.latitude},${data.longitude}&cbp=12,20.09,,0,5&layer=c`}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-sm text-blue-500 underline italic px-4 py-2 rounded-md"
                    >
                        Lihat Google Street View
                    </a>
                </div>
                <div>
                    <When condition={data.status === "invalid"}>
                        <ListItem title="Keterangan Invalid" subTitle={data?.invalid_reason ?? "-"} />
                    </When>
                </div>
                <div>
                    <When condition={tabOptions.length > 0}>
                        <Tabs tabs={tabOptions} onChange={(value) => setSectionId(Number(value))} />
                    </When>
                    <When condition={respondentWithResponse !== undefined}>
                        <DetailResponses data={respondentWithResponse} sectionId={sectionId} />
                    </When>
                </div>
                <div className="w-full inline-flex flex-wrap justify-between items-center gap-3 mt-4">
                    <Button variant="ghost" onClick={handleSeeOnTheMaps} className="sm:w-full md:w-full">
                        <ImMap />
                        <span>Lihat di Maps</span>
                    </Button>
                    <div>
                        <Switch>
                            <Case
                                condition={
                                    !configStart.isPending &&
                                    !configEnd.isPending &&
                                    dayjs(dayjs().format("YYYY-MM-DD")).isBetween(
                                        configStart.data?.config_value,
                                        configEnd.data?.config_value,
                                        "day",
                                        "[]"
                                    )
                                }
                            >
                                <div className="flex justify-end gap-4">
                                    <When
                                        condition={
                                            !!intersection(["supervisor-survey-mitra", "admin-survey-mitra"], user.role_keys).length &&
                                            ["unvalidated"].includes(data.status!)
                                        }
                                    >
                                        <Button variant="ghost" onClick={handleDecline} className="w-[144px]">
                                            Tolak
                                        </Button>
                                        <Button onClick={handleValidate} className="w-[144px]">
                                            Validasi
                                        </Button>
                                    </When>
                                    <When
                                        condition={
                                            !!intersection(["admin-survey-branch"], user.role_keys).length &&
                                            ["valid-mitra", "invalid"].includes(data.status!)
                                        }
                                    >
                                        <Button variant="ghost" onClick={handleDecline} className="w-[144px]">
                                            Tolak
                                        </Button>
                                        <Button onClick={handleValidate} className="w-[144px]">
                                            Validasi
                                        </Button>
                                    </When>
                                </div>
                            </Case>
                            <Case condition={configStart.isPending || configEnd.isPending}>
                                <Spinner />
                            </Case>
                        </Switch>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SurveyModal;
