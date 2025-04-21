/** @type {import('next').NextConfig} */
const nextConfig = {

    experimental: {
        serverComponentsHmrCache: false, //defaults to true
    },

    images:{
        remotePatterns: [ 
            {
                protocol: "https",
                hostname: "xgyemgomypcwqfzyidus.supabase.co",
                pathname: "/**", 
            },
        ],
    },

    async headers(){
        return [
            {
                source:"/embed",
                headers: [
                    {
                    key: "Content-Security-Policy",
                    value: "frame src 'self' https://vehiql-wait.created.app"
                    } 
                ]
            }
        ]
    }
};

export default nextConfig;
