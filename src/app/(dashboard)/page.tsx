import { PageHeader } from "@/components/shared/PageHeader";

export default function Home() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tableau de bord" 
        subtitle="Année scolaire 2025-2026"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 rounded-xl bg-card border border-border shadow-sm p-6 flex flex-col justify-center text-card-foreground">
          <p className="text-sm font-medium text-muted-foreground">Total classes</p>
          <p className="text-3xl font-bold mt-2">42</p>
        </div>
        <div className="h-32 rounded-xl bg-card border border-border shadow-sm p-6 flex flex-col justify-center text-card-foreground">
          <p className="text-sm font-medium text-muted-foreground">Effectif total</p>
          <p className="text-3xl font-bold mt-2">1 247</p>
        </div>
        <div className="h-32 rounded-xl bg-card border border-border shadow-sm p-6 flex flex-col justify-center text-card-foreground">
          <p className="text-sm font-medium text-muted-foreground">Moyenne / classe</p>
          <p className="text-3xl font-bold mt-2">29.7</p>
        </div>
      </div>
      
      <div className="h-96 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-card-foreground">
        <p className="text-muted-foreground">Contenu de la page...</p>
      </div>
    </div>
  );
}
