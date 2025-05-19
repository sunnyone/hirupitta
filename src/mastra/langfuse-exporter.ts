import { LangfuseExporter } from "langfuse-vercel";

let exporter: LangfuseExporter | undefined;

export function getLangfuseExporter() {
    console.log("Get Langfuse exporter");
    if (!exporter) {
        console.log("Creating new");
        exporter = new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_HOST,
        });
    } else {
        console.log("Existing one.")
    }

    return exporter;
}
