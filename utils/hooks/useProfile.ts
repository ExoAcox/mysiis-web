import { useProfileStore, profileDefaultValue } from "@libs/store";

const useProfile = () => {
    const profile = useProfileStore((state) => state.data);
    return profile;
};

export const resetProfile = () => {
    useProfileStore.setState({ ready: false, data: profileDefaultValue });
};

export default useProfile;
