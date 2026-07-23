export const basePath = "/alduin";

export function withBasePath(path: string) {
  return `${basePath}${path}`;
}
