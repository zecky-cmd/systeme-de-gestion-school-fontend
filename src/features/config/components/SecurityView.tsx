import React from "react";
import { ShieldCheck, Lock, Smartphone, Eye, History, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AUDIT_LOGS = [
  { id: 1, user: "Amadou Kone", action: "UPDATE", detail: "Tarifs Scolarité T1", date: "04/05/2026 18:30" },
  { id: 2, user: "Mariam Diallo", action: "DELETE", detail: "Coefficient SVT", date: "04/05/2026 15:45" },
  { id: 3, user: "Admin", action: "CONFIG", detail: "Double authentification activée", date: "04/05/2026 10:20" },
];

export function SecurityView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Politique de mots de passe */}
        <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Lock size={16} className="text-primary" /> 
              Mots de passe
            </CardTitle>
            <CardDescription className="text-xs">Exigences de sécurité pour les comptes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Longueur minimale</Label>
                <p className="text-[10px] text-muted-foreground">Nombre de caractères minimum</p>
              </div>
              <Select defaultValue="8">
                <SelectTrigger className="w-16 h-8 rounded-md border-slate-200 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="8" className="text-xs">8</SelectItem>
                  <SelectItem value="10" className="text-xs">10</SelectItem>
                  <SelectItem value="12" className="text-xs">12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {[
              { label: "Caractères spéciaux", desc: "Exiger au moins un symbole", icon: <ShieldCheck size={14} /> },
              { label: "Majuscules requises", desc: "Exiger au moins une majuscule", icon: <Lock size={14} /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-md bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold">{item.label}</Label>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch defaultChecked className="scale-75" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sessions & MFA */}
        <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Smartphone size={16} className="text-primary" /> 
              Sessions & MFA
            </CardTitle>
            <CardDescription className="text-xs">Contrôle des accès</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-md bg-white border border-primary/10 flex items-center justify-center text-primary">
                  <Smartphone size={14} />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">Double authentification (2FA)</Label>
                  <p className="text-[10px] text-muted-foreground italic">Optionnel pour les enseignants</p>
                </div>
              </div>
              <Switch className="scale-75" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-md bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                  <History size={14} />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold">Expiration de session</Label>
                  <p className="text-[10px] text-muted-foreground">Déconnexion après inactivité</p>
                </div>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-24 h-8 rounded-md border-slate-200 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  <SelectItem value="30" className="text-xs">30 min</SelectItem>
                  <SelectItem value="60" className="text-xs">1 h</SelectItem>
                  <SelectItem value="off" className="text-xs">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journal d'Audit */}
      <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <History size={16} className="text-primary" /> 
            Journal d'Audit
          </CardTitle>
          <CardDescription className="text-xs">Historique des actions critiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {AUDIT_LOGS.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-muted-foreground">{log.date}</span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <User size={10} className="text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold">{log.user}</span>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-bold px-1.5 h-4 border-none",
                  log.action === "DELETE" ? "bg-red-50 text-red-700" :
                  log.action === "UPDATE" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
                )}>
                  {log.action}
                </Badge>
                <span className="text-[11px] text-muted-foreground">{log.detail}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300">
                 <Eye size={12} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
