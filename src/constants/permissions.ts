export type UserRole = "adm" | "dir" | "ens" | "par" | "elv";

export interface NavItem {
  title: string;
  url: string;
  roles: UserRole[]; // Qui peut voir ce menu
}

export const NAV_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["adm", "dir", "ens", "par", "elv"], // Tout le monde voit le dashboard (mais le contenu différera)
  "/eleves": ["adm", "dir"],
  "/classes": ["adm", "dir", "ens"],
  "/enseignants": ["adm", "dir"],
  "/notes": ["adm", "dir", "ens", "par", "elv"],
  "/paiements": ["adm", "dir"],
  "/emplois": ["adm", "dir", "ens", "par", "elv"],
  "/absences": ["adm", "dir", "ens", "par", "elv"],
  "/messagerie": ["adm", "dir", "ens", "par", "elv"],
  "/config": ["adm"],
};

export const ACTION_PERMISSIONS = {
  CREATE_STUDENT: ["adm", "dir"],
  DELETE_STUDENT: ["adm"],
  EDIT_STUDENT: ["adm", "dir"],
  MANAGE_PAYMENTS: ["adm", "dir"],
  EDIT_NOTES: ["adm", "dir", "ens"],
  SYSTEM_CONFIG: ["adm"],
};

/**
 * Hook-like logic to check permissions
 */
export const canAccess = (role: UserRole, path: string): boolean => {
  const allowedRoles = NAV_PERMISSIONS[path];
  return allowedRoles ? allowedRoles.includes(role) : true;
};

export const canPerform = (role: UserRole, action: keyof typeof ACTION_PERMISSIONS): boolean => {
  return ACTION_PERMISSIONS[action].includes(role);
};
