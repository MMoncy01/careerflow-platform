export type CurrentUser = {
  sub: string;
  email: string;
};

export function userIdFromReq(req: any): string {
  return (req.user as CurrentUser).sub;
}