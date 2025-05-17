import { registerOTel } from "@vercel/otel";

console.error("Import meta outer");
console.error(import.meta.url);

export async function logDebuggingInfo() {
  console.error("Debugging register");
  console.error(registerOTel as any);
  console.error(registerOTel.toString());


  console.error("Import meta inner");
  console.error(import.meta.url);
  const resolve = import.meta.resolve as any;
  if (resolve) {
    console.error(resolve("@vercel/otel"));
  } else {
    console.error("resolve is not found");
  }
}
