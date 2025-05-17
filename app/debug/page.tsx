import { logDebuggingInfo } from "./outputlog";

export default async function Page() {
    await logDebuggingInfo();

    const time = new Date().toISOString();

    return <>Hello: ${time}</>;
}