import { logDebuggingInfo } from "./outputlog";

export const dynamic =  'force-dynamic';

export default async function Page() {
    await logDebuggingInfo();

    const time = new Date().toISOString();

    return <>Hello: ${time}</>;
}