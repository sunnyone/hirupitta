import { logDebuggingInfo } from "./outputlog";

export default async function Page() {
    await logDebuggingInfo();

    return <>Hello</>;
}