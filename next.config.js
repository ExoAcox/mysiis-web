// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = {
    output: "standalone",
    swcMinify: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ["storage.googleapis.com", "api.veritrans.co.id", "play.min.io", "smd-core.udata.id", "minio-revoluzio-dev.mysiis.io"],
        minimumCacheTTL: 60 * 60 * 2,
        unoptimized: true,
    },
    compiler:
        process.env.NODE_ENV === "production"
            ? {
                removeConsole: {
                    exclude: ["error", "warn"],
                },
            }
            : {},
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [{ loader: "@svgr/webpack", options: { icon: true } }],
        });

        return config;
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors 'self'",
                    },
                    {
                        key: "Cross-Origin-Resource-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/home",
            },
            {
                source: "/healthz",
                destination: "/api/healthz",
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/home",
                destination: "/",
                permanent: true,
            },
        ];
    },
};
