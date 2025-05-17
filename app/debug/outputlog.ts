import { registerOTel } from "@vercel/otel";

console.log("Import meta outer");
console.log(import.meta.url);

export async function logDebuggingInfo() {
  console.log("Debugging register");
  console.log(registerOTel as any);
  console.log(registerOTel.toString());


  console.log("Import meta inner");
  console.log(import.meta.url);
  const resolve = import.meta.resolve as any;
  if (resolve) {
    console.log(resolve("@vercel/otel"));
  } else {
    console.log("resolve is not found");
  }
}
