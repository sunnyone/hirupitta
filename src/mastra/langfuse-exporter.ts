import { LangfuseExporter } from "langfuse-vercel";

let exporter: LangfuseExporter | undefined;

export function getLangfuseExporter() {
    if (!exporter) {
        exporter = new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_HOST,
        });
    }
    
    return exporter;
}
