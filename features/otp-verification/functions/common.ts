export const getPrivatePhoneNumber = (phoneNumber: string) => {
    const newPhoneNumber = phoneNumber.slice(0, phoneNumber.length - 3);
    const privatePhoneNumber = newPhoneNumber + "***";

    return privatePhoneNumber;
};

const padTime = (time: number) => {
    return String(time).length === 1 ? `0${time}` : `${time}`;
};

export const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${padTime(minutes)}:${padTime(seconds)}`;
};
