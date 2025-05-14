import { LangfuseExporter } from "langfuse-vercel";

export function getLangfuseExporter() {
    return new LangfuseExporter({
        publicKey: process.env.LANGFUSE_PUBLIC_KEY,
        secretKey: process.env.LANGFUSE_SECRET_KEY,
        baseUrl: process.env.LANGFUSE_HOST,
    });
}
