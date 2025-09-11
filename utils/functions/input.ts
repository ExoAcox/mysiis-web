export const getVariant = (variant: string) => {
    if (variant === "underlined") {
        return `pt-1 border-t-transparent border-x-transparent`;
    } else {
        return `rounded-md`;
    }
};

export const uploadFile = (args?: {
    maxSize?: number;
    accept?: string;
}): Promise<{ file?: File; error?: "empty" | "not-supported" | "exceed-limit" }> => {
    const { maxSize = 1000000, accept = "image/png,image/jpg,image/jpeg" } = args!;

    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement)?.files?.[0];

            if (!file) {
                resolve({ error: "empty" });
            }

            if (!accept.split(",").includes(file!.type)) {
                resolve({ error: "not-supported" });
            }
            if (file!.size > maxSize) {
                resolve({ error: "exceed-limit" });
            }

            resolve({ file });
        };

        input.click();
    });
};
