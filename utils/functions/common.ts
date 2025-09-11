import axios from "axios";
import { socket } from "@libs/socket";
import ExcelJS from 'exceljs';



export const logout = async (redirect: string | undefined = "/login") => {
    socket?.close();
    await axios.post("/api/logout");
    window.location.href = redirect;
};

export const intersection = (array1: string[], array2: string[]) => {
    return array1.filter((value) => {
        return array2.includes(value);
    });
};

export const convertHtmlToString = (html: string) => {
    const divContainer = document.createElement("div");
    divContainer.innerHTML = html;
    return divContainer.textContent || divContainer.innerText || "";
};

export const errorHelper = (error: unknown): DataError => {
    if (error instanceof Error || typeof error === "object") {
        return error;
    } else {
        return { message: String(error) };
    }
};

export const titleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word: string) => {
            return word.replace(word[0], word[0]?.toUpperCase());
        })
        .join(" ");
};

export const validationPhoneNumber = (phone: string) => {
    return !(!phone || !/^(62|08)[1-9][0-9]{7,10}$/.test(phone));
};

export const validationEmail = (email: string) => {
    return !(!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email));
};

export const compareNumbers = (a: number, b: number) => {
    return a - b;
};

export const getPercent = ({ partial, total, decimal = 2 }: { partial: number; total: number; decimal?: number }) => {
    const value = (100 * partial) / total;

    if (isNaN(value) || !Number.isFinite(value)) {
        return 0;
    } else {
        return value.toFixed(decimal);
    }
};

export const objectMap = <Value>(object: { [key: string]: Value }, callback: (key: string, value: Value) => void) => {
    const keys = Object.keys(object);
    return keys.map((key) => callback(key, object[key]));
};

export const getBold = (str: string, keyword: string) => {
    const n = str.toUpperCase();
    const k = keyword.toUpperCase();
    const x = n.indexOf(k);
    if (!k || x === -1) {
        return str;
    }
    const l = k.length;
    return str.substr(0, x) + "<b>" + str.substr(x, l) + "</b>" + str.substr(x + l);
};

export const getUrl = (str: string) => {
    const match = str.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi);
    let final = str;
    match?.map((url) => {
        final = final.replace(url, '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a>");
    });
    return final;
};

export const customFormData = (body: any) => {
    const data = new FormData();
    for (const key in body) {
        data.append(key, body[key]);
    }
    return data;
};

export const mathRandom = () => {
    const typedArray = new Uint8Array(1);
    const randomValue = crypto.getRandomValues(typedArray)[0];
    const randomFloat = randomValue / Math.pow(2, 8);
    return randomFloat;
};

// function for separating number with dot when thousand

export const formatThousands = (number: number = 0) => {
    return number.toLocaleString('de-DE');
};


export enum Delimiter {
    COMMA = ',',
    SEMICOLON = ';',
    TAB = '\t',
    SPACE = ' ',
    CARET = '^',
}

export function jsonToCsvExport(jsonArray: any[], delimiter: Delimiter): string {
    if (jsonArray.length === 0) return '';

    const keys = Array.from(new Set(jsonArray.flatMap(Object.keys)));
    const header = keys.join(delimiter);
    const rows = jsonArray.map(obj => {
        return keys.map(key => obj[key] !== undefined ? obj[key] : '').join(delimiter);
    });

    return [header, ...rows].join('\n');
}

export function downloadCsv(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// 
export const csvToXlsx = async (csvData: string, columnTypes: string[]): Promise<Blob> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const rows = csvData.split('\n').map(row => row.split('^'));
    worksheet.addRows(rows);

    // Set the data type for each column
    columnTypes.forEach((type, index) => {
        const column = worksheet.getColumn(index + 1);
        column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            if (cell.value === undefined || cell.value === null) return; // Skip undefined or null values
    
            switch (type) {
                case 'number':
                    cell.value = Number(cell.value);
                    break;
                case 'boolean':
                    cell.value = cell.value === 'true';
                    break;
                // Add more cases as needed
                default:
                    // 'cell.value' is assigned to itself.
                    cell.value = cell.value ?? ''
            }
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const downloadXlsx = async (csvData: string, fileName: string, options: string[]): Promise<void> => {
    const xlsxBlob = await csvToXlsx(csvData, options);
    const url = URL.createObjectURL(xlsxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};