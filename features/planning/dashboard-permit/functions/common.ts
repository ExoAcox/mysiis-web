import { getSupervisor } from "@api/survey-demand/supervisor";
import { UserDataStore, useUserDataStore } from "@features/planning/dashboard-permit/store/global";

interface Tab {
    label: string;
    value: string;
}

export const tabOptions = (user: User) => {
    const roles: string[] = user.role_keys;
    const tabs: Tab[] = [];

    if (roles.includes("admin-survey-nasional")) {
      tabs.push({ label: "Dashboard", value: "dashboard" });
    } else if (roles.includes("admin-survey-region")) {
      tabs.push({ label: "Dashboard", value: "dashboard" });
    } else if (roles.includes("supervisor-survey-mitra")) {
      tabs.push({ label: "Dashboard", value: "dashboard" });
      tabs.push({ label: "Assignment", value: "assignment" });
    }

    return tabs;
};

export const regionalListFormat = (userDataStore: UserDataStore, regional: string[]) => {
  if (!userDataStore.role) return [];
  if (userDataStore.role === "admin-survey-mitra") {
    return [{ label: "Semua Regional", value: "" }, ...regional.map((value) => ({ label: value, value }))];
  }

  if (userDataStore.telkom_regional && userDataStore.telkom_regional !== "National") {
    return [{ label: userDataStore.telkom_regional, value: userDataStore.telkom_regional }];
  } else {
    return [{ label: "Semua Regional", value: "" }, ...regional.map((value) => ({ label: value, value }))];
  }
};

export const witelListFormat = (userDataStore: UserDataStore, witel: string[]) => {
  if (!userDataStore.role) return [];

  if (userDataStore.telkom_witel.length > 1) {
    return [{ label: "Semua Witel", value: "" }, ...userDataStore.telkom_witel.map((witel) => ({ label: witel, value: witel }))];
  } else if (userDataStore.telkom_witel.length && userDataStore.telkom_witel[0] !== "All") {
    return userDataStore.telkom_witel.map((witel) => ({ label: witel, value: witel }));
  } else {
    return [{ label: "Semua Witel", value: "" }, ...witel.map((value) => ({ label: value, value }))];
  }
};

export const getUserData = async (user: User) => {
  const roles: string[] = user.role_keys;

  if (roles.includes("admin-survey-nasional")) {
      useUserDataStore.setState({
          telkom_regional: "",
          telkom_witel: [],
          regional: "",
          witel: [],
          vendor: "",
          role: "admin-survey-nasional",
      });

      return { 
          telkom_regional: user.regional !== "National" ? user.regional : "",
          regional: user.tsel_region !== "National" ? user.tsel_region : "",

      };
  } else if (roles.includes("admin-survey-region")) {
      useUserDataStore.setState({
          regional: user.tsel_region !== "National" ? user.tsel_region : "",
          witel: [],
          telkom_regional: user.regional !== "National" ? user.regional : "",
          telkom_witel: [],
          vendor: "",
          role: "admin-survey-region",
      });

      return { 
          telkom_regional: user.regional !== "National" ? user.regional : "",
          regional: user.tsel_region !== "National" ? user.tsel_region : "",
      };
  } else if (roles.includes("admin-survey-branch")) {
      useUserDataStore.setState({
          telkom_regional: user.regional !== "National" ? user.regional : "",
          telkom_witel: user.witel && user.witel !== "All" ? [user.witel] : [],
          regional: user.tsel_region !== "National" ? user.tsel_region : "",
          witel: user.tsel_branch && user.tsel_branch !== "All" ? [user.tsel_branch] : [],
          vendor: "",
          role: "admin-survey-branch",
      });

      return { vendor: user.vendor ?? "" };
  }  else if (roles.includes("supervisor-survey-mitra")) {
      try {
          const supervisor = await getSupervisor(user.userId);

          useUserDataStore.setState({
              telkom_regional: supervisor.telkom_treg,
              telkom_witel: supervisor.telkom_witel || [],
              regional: supervisor.mysista_treg,
              witel: supervisor.mysista_witel || [],
              vendor: supervisor.mysista_source,
              role: "supervisor-survey-mitra",
          });

          return {
              telkom_regional: supervisor.telkom_treg,
              telkom_witel: supervisor.telkom_witel.length === 1 ? supervisor.telkom_witel[0] : "",
              regional: supervisor.mysista_treg,
              witel: supervisor.mysista_witel.length === 1 ? supervisor.mysista_witel[0] : "",
              vendor: supervisor.mysista_source,   
          };
      } catch {
          useUserDataStore.setState({
              role: "supervisor-survey-mitra",
          });

          return {
              regional: "undefined",
              witel: [],
              vendor: "undefined",
              role: "supervisor-survey-mitra",
          };
      }
  } else {
      useUserDataStore.setState({
          regional: "undefined",
          witel: [],
          vendor: "undefined",
          role: "supervisor-survey-mitra",
      });

      return {
          regional: "undefined",
          witel: "undefined",
          vendor: "undefined",
      };
  }
};
