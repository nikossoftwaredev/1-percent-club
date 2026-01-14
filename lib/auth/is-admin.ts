import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// Static list of admin emails
const ADMIN_EMAILS = ["dollswithballs420@gmail.com"];

/**
 * Check if the current user is an admin
 * @returns true if the user's email is in the admin list
 */
export const isAdmin = async (): Promise<boolean> => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return false;

  return ADMIN_EMAILS.includes(session.user.email);
};

/**
 * Check if a specific email is an admin
 * @param email - Email to check
 * @returns true if the email is in the admin list
 */
export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};