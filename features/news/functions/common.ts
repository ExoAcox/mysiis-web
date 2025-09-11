export const convertFileName = (fileName: string) => {
    const strMatch = fileName.match(/[a-z0-9]{12}/);

    if (strMatch) {
        const indexOfStrMatch = fileName.indexOf(strMatch[0]);
        const newFileName = fileName.substring(indexOfStrMatch + 13);

        return newFileName;
    }

    return fileName;
};
