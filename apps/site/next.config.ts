import type { NextConfig } from "next";
import { basePath } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  transpilePackages: ["@alduin/design-system"],
  output: "export",
  basePath,
};

export default nextConfig;
