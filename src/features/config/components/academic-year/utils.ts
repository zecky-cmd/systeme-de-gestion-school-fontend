export const getStatusLabel = (status: string) => {
  switch (status) {
    case "ouv": return "Ouverte";
    case "clos": return "Clôturée";
    case "arch": return "Archivée";
    default: return status;
  }
};

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "ouv": return "border-green-200 bg-green-50 text-green-700";
    case "clos": return "border-border bg-secondary text-muted-foreground";
    case "arch": return "border-amber-200 bg-amber-50 text-amber-700";
    default: return "border-slate-200 bg-slate-50 text-slate-700";
  }
};
