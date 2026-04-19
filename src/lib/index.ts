import { createCapstoneSdk } from "../../../Capstone/frontend/dist/index";

const sdk = createCapstoneSdk({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081",
});

export default sdk;
