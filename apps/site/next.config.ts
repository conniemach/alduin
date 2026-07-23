import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@alduin/design-system"],
  output: "export",
  basePath: "/alduin",
};

export default nextConfig;
