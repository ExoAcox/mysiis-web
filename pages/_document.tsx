import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            <body className={process.env.NODE_ENV === "development" ? "debug-screens" : ""}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
