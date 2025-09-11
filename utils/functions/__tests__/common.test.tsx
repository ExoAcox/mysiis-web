import {
    compareNumbers,
    convertHtmlToString,
    customFormData,
    errorHelper,
    getBold,
    getPercent,
    getUrl,
    intersection,
    objectMap,
    titleCase,
    validationEmail,
    validationPhoneNumber,
} from "../common";

describe("intersection", () => {
    it("should return the intersection of two arrays", () => {
        const array1 = ["a", "b", "c"];
        const array2 = ["b", "c", "d"];

        expect(intersection(array1, array2)).toEqual(["b", "c"]);
    });

    it("should return an empty array if there is no intersection between two arrays", () => {
        const array1 = ["a", "b", "c"];
        const array2 = ["d", "e", "f"];

        expect(intersection(array1, array2)).toEqual([]);
    });

    it("should handle empty arrays as inputs without throwing an error", () => {
        expect(intersection([], [])).toEqual([]);
    });
});

describe("convertHtmlToString", () => {
    it("should replace <br>", () => {
        const html = "<p>Hello<br>World</p>";
        const expected = "HelloWorld";

        expect(convertHtmlToString(html)).toEqual(expected);
    });

    it("should replace all HTML tags with an empty string", () => {
        const html = "<p>Hello<b>World</b></p>";
        const expected = "HelloWorld";

        expect(convertHtmlToString(html)).toEqual(expected);
    });

    it("should return an empty string when passed an empty string", () => {
        const html = "";
        const expected = "";

        expect(convertHtmlToString(html)).toEqual(expected);
    });

    it("should return the same string when passed a plain text string", () => {
        const html = "Hello World";
        const expected = "Hello World";

        expect(convertHtmlToString(html)).toEqual(expected);
    });
});

describe("errorHelper", () => {
    it("should return an error object when passed an instance of Error", () => {
        const error = new Error("test");

        const result = errorHelper(error);

        expect(result).toEqual(error);
    });

    it("should return an object with a message property when passed a non-Error object", () => {
        const error = { message: "test" };

        const result = errorHelper(error);

        expect(result).toEqual({ message: "test" });
    });

    it("should return an object with a message property when passed a non-object value", () => {
        const error = "test";

        const result = errorHelper(error);

        expect(result).toEqual({ message: "test" });
    });
});

describe("titleCase", () => {
    it("should return a string with the first letter of each word capitalized", () => {
        expect(titleCase("hello world")).toBe("Hello World");
    });

    it("should return an empty string if passed an empty string", () => {
        expect(titleCase("")).toBe("");
    });

    it("should handle strings with multiple words", () => {
        expect(titleCase("hello there world")).toBe("Hello There World");
    });

    it("should handle strings with special characters", () => {
        expect(titleCase("hello, there! world")).toBe("Hello, There! World");
    });

    it("should handle strings with numbers", () => {
        expect(titleCase("hello123 there456 world789")).toBe("Hello123 There456 World789");
    });
});

describe("validationPhoneNumber", () => {
    it("should return true when valid phone number is passed", () => {
        const phone = "6281234567890";

        expect(validationPhoneNumber(phone)).toBeTruthy();
    });

    it("should return true when valid phone number is passed", () => {
        const phone = "081234567890";

        expect(validationPhoneNumber(phone)).toBeTruthy();
    });

    it("should return false when invalid phone number is passed", () => {
        const phone = "1234567890";

        expect(validationPhoneNumber(phone)).toBeFalsy();
    });

    it("should return false when empty string is passed", () => {
        const phone = "";

        expect(validationPhoneNumber(phone)).toBeFalsy();
    });
});

describe("validationEmail", () => {
    it("should return true when valid email is passed", () => {
        const result = validationEmail("test@example.com");

        expect(result).toBe(true);
    });

    it("should return false when invalid email is passed", () => {
        const result = validationEmail("testexample.com");

        expect(result).toBe(false);
    });

    it("should return false when empty string is passed", () => {
        const result = validationEmail("");

        expect(result).toBe(false);
    });
});

describe("compareNumbers", () => {
    it("should return the difference between two numbers", () => {
        const a = 5;
        const b = 3;

        expect(compareNumbers(a, b)).toEqual(2);
    });

    it("should return 0 if two numbers are equal", () => {
        const a = 5;
        const b = 5;

        expect(compareNumbers(a, b)).toEqual(0);
    });

    it("should return a negative number if the first number is smaller than the second number", () => {
        const a = 3;
        const b = 5;

        expect(compareNumbers(a, b)).toBeLessThan(0);
    });

    it("should return a positive number if the first number is greater than the second number", () => {
        const a = 5;
        const b = 3;

        expect(compareNumbers(a, b)).toBeGreaterThan(0);
    });
});

describe("getPercent", () => {
    it("should return a percentage value", () => {
        const result = getPercent({ partial: 1, total: 10 });

        expect(result).toBe("10.00");
    });

    it("should default to 2 decimal places", () => {
        const result = getPercent({ partial: 1, total: 10, decimal: 3 });

        expect(result).toBe("10.000");
    });

    it("should return 0 if not provided valid arguments", () => {
        const result = getPercent({ partial: 1, total: 0 });

        expect(result).toBe(0);
    });

    it("should return 0 if arguments NaN", () => {
        const result = getPercent({ partial: NaN, total: 10 });

        expect(result).toBe(0);
    });
});

describe("objectMap", () => {
    const object = { a: 1, b: 2, c: 3 };
    const array: number[] = [];

    const callback = (key: string, value: number) => {
        array.push(value);
    };

    it("should call the callback for each key", () => {
        objectMap(object, callback);
        expect(array).toEqual([1, 2, 3]);
    });

    it("should map the objects keys and values as expected", () => {
        const result = objectMap(object, (key, value) => ({ key, value }));
        expect(result).toEqual([
            { key: "a", value: 1 },
            { key: "b", value: 2 },
            { key: "c", value: 3 },
        ]);
    });
});

describe("getBold", () => {
    it("should return the string with the keyword in bold", () => {
        const str = "This is a test";
        const keyword = "test";

        const result = getBold(str, keyword);

        expect(result).toBe("This is a <b>test</b>");
    });

    it("should be case insensitive", () => {
        const str = "This is a Test";
        const keyword = "tEsT";

        const result = getBold(str, keyword);

        expect(result).toBe("This is a <b>Test</b>");
    });

    it("should return the original string", () => {
        const str = "This is a test";
        const keyword = "hello";

        const result = getBold(str, keyword);

        expect(result).toBe("This is a test");
    });
});

describe("getUrl", () => {
    it("should replace the url with a link", () => {
        const str = "This is a test string with a url https://www.example.com";
        const expected =
            'This is a test string with a url <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">https://www.example.com</a>';

        expect(getUrl(str)).toEqual(expected);
    });

    it("should not replace the string if no url is present", () => {
        const str = "This is a test string without a url";

        expect(getUrl(str)).toEqual(str);
    });
});

describe("customFormData", () => {
    it("should return a FormData object", () => {
        const body = { key1: "value1", key2: "value2" };
        const data = customFormData(body);

        expect(data).toBeInstanceOf(FormData);
    });

    it("should append the keys and values to the FormData object", () => {
        const body = { key1: "value1", key2: "value2" };
        const data = customFormData(body);

        expect(data.get("key1")).toBe("value1");
        expect(data.get("key2")).toBe("value2");
    });
});
