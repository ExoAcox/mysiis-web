// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import useProfile from "@hooks/useProfile";

import { CardSection, MainSection, SummarySection } from "@features/planning/dashboard-microdemand/components/dashboard";
import { TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { getUserData, tabOptions } from "@features/planning/dashboard-microdemand/functions/common";
import { fetchSummaryDetail, fetchSurvey } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";
import { fetchPolygonTselFilter } from "@features/planning/dashboard-microdemand/queries/global/polygon";
import { fetchListUser } from "@features/planning/dashboard-microdemand/queries/global/user";
import { useFilterStore, useFilterSummaryStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { usePolygonStore, useUserDataStore } from "@features/planning/dashboard-microdemand/store/global";

import { Responsive, Wrapper } from "@components/layout";
import { intersection } from "@functions/common";
import { getVendorPolygon } from "@features/planning/dashboard-microdemand/functions/dashboard";
import { getSupervisor } from "@api/survey-demand/supervisor";

const Dashboard: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const profile = useProfile();

    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const filterSummary = useFilterSummaryStore();
    const polygonStore = usePolygonStore();
    const { regional, row, witel, vendor, status, category, surveyor, polygon, startDate, endDate } = filterStore;

    const router = useRouter();

    const getData = (init?: string) => {
        if (init) filterStore.set({ page: 1 });
        fetchSurvey({ ...filterStore, page: init ? 1 : filterStore.page });
    };

    const getUser = async () => {
        const filter = await getUserData(user);
        filterStore.set(filter);
    };

    useEffect(() => {
        if (intersection(user.role_keys, ["admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"]).length) {
            getData("init");
        }
    }, [userDataStore.role, row, regional, witel, vendor, status, category, surveyor, polygon, startDate, endDate]);

    useEffect(() => {
        if (!userDataStore.role) {
            return;
        } else if (userDataStore.role === "supervisor-survey-mitra") {
            fetchListUser({ regional: [userDataStore.regional], witel: userDataStore.witel, vendor: userDataStore.vendor });
            // fetchPolygon(user.userId);
            fetchPolygonTselFilter({ page: 1, row: 1000, witel: JSON.stringify(userDataStore.witel), vendor: userDataStore.vendor ? userDataStore.vendor : "" });
        } else {
            fetchListUser({ row: 1, regional: [userDataStore.regional], witel: userDataStore.witel, vendor: userDataStore.vendor });
            if (userDataStore.role === "admin-survey-branch") {
                fetchPolygonTselFilter({ page: 1, row: 1000, area: user.tsel_area!, treg: user.tsel_region!, witel: JSON.stringify([user.tsel_branch!]) });
            } else {
                polygonStore.set({ data: [], status: "resolve", error: null });
            }
        }
    }, [userDataStore.role]);

    useEffect(() => {
        if (intersection(user.role_keys, ["admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"]).length) {
            getUser();
        }
    }, []);

    useEffect(() => {
        const { role_keys, tsel_area, tsel_region, tsel_branch, vendor: userVendor } = user;
        if (role_keys.includes("admin-survey-nasional")) {
            filterSummary.set({ area: "", region: "", branch: "", vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
            fetchSummaryDetail({ area: "", region: "", branch: "", vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
        } else if (role_keys.includes("admin-survey-area")) {
            filterSummary.set({ area: tsel_area, region: "", branch: "", vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
            fetchSummaryDetail({ area: tsel_area!, region: "", branch: "", vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
        } else if (role_keys.includes("admin-survey-region")) {
            filterSummary.set({ area: tsel_area, region: tsel_region, branch: "", vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
            fetchSummaryDetail({ area: tsel_area!, region: tsel_region, branch: "", vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
        } else if (role_keys.includes("admin-survey-branch")) {
            filterSummary.set({ area: tsel_area, region: tsel_region, branch: tsel_branch, vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
            fetchSummaryDetail({ area: tsel_area!, region: tsel_region, branch: tsel_branch, vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
        } else if (role_keys.includes("supervisor-survey-mitra")) {
            getSupervisor(user.userId).then((res) => {
                if (res) {
                    filterSummary.set({ area: tsel_area, region: tsel_region, branch: tsel_region, vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
                    fetchSummaryDetail({ area: tsel_area!, branch: JSON.stringify(res.mysista_witel), vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
                }
            });
            // filterSummary.set({ area: tsel_area, region: tsel_region, branch: tsel_branch, vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
            // fetchSummaryDetail({ area: tsel_area!, region: tsel_region, branch: tsel_branch, vendor: userVendor === "All" ? "" : getVendorPolygon(userVendor!) });
        }

    }, []);

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_dashboard_microdemand_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    return (
        <Wrapper
            user={user}
            title="Dashboard Microdemand"
            tab={{
                value: "dashboard",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-microdemand/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-0">
                <TitleBar>Menu untuk menampilkan & melakukan validasi terhadap survey yang telah dilakukan Suveyor</TitleBar>
                <div className="flex flex-col gap-6 mb-12 sm:mb-0">
                    <When condition={intersection(user.role_keys, ["admin-survey-nasional", "admin-survey-area", "admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"]).length}>
                        <SummarySection user={user} />
                    </When>
                    <When condition={intersection(user.role_keys, ["admin-survey-branch", "supervisor-survey-mitra"]).length}>
                        <CardSection user={user} />
                    </When>
                    <When condition={intersection(user.role_keys, ["admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"]).length}>
                        <MainSection user={user} device={device} refresh={getData} />
                    </When>
                </div>
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["surveydemand-web"],
    });

    return server;
});

export default Dashboard;
