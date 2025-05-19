import { LangfuseExporter } from "langfuse-vercel";

declare global {
    var langfuseExporter: LangfuseExporter | undefined;
}

export function getLangfuseExporter() {
    console.log("Get Langfuse exporter");
    if (!globalThis.langfuseExporter) {
        console.log("Creating new");
        globalThis.langfuseExporter = new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_HOST,
        });
    } else {
        console.log("Existing one.")
    }

    return globalThis.langfuseExporter;
}
