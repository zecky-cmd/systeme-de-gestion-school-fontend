import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfigUser } from "@/services/user-management.service";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ConfigUser>) => void;
  user?: ConfigUser | null;
}

export function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<ConfigUser>>({
    nom: "",
    prenom: "",
    email: "",
    role: "ens",
    estActif: true,
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        role: "ens",
        estActif: true,
        password: "",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-2xl overflow-hidden p-0">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 font-heading">
              {user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-slate-700 font-medium">Prénom</Label>
              <Input 
                id="prenom" 
                value={formData.prenom || ""} 
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="ex: Jean"
                className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-slate-700 font-medium">Nom</Label>
              <Input 
                id="nom" 
                value={formData.nom || ""} 
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="ex: Dupont"
                className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email professionnel</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email || ""} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ex: jean.dupont@ecole.com"
              className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20"
              required
            />
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Mot de passe provisoire</Label>
              <Input 
                id="password" 
                type="password"
                value={formData.password || ""} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 caractères"
                className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20"
                required={!user}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-700 font-medium">Rôle système</Label>
            <Select 
              value={formData.role || "ens"} 
              onValueChange={(value: string | null) => setFormData(prev => ({ ...prev, role: (value as any) || "ens" }))}
            >
              <SelectTrigger id="role" className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adm">Administrateur</SelectItem>
                <SelectItem value="dir">Directeur</SelectItem>
                <SelectItem value="ens">Enseignant</SelectItem>
                <SelectItem value="par">Parent</SelectItem>
                <SelectItem value="elv">Élève</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-0.5">
              <Label className="text-slate-900 font-medium">Compte actif</Label>
              <p className="text-xs text-slate-500">Désactiver pour suspendre l'accès</p>
            </div>
            <Switch 
              checked={formData.estActif ?? true} 
              onCheckedChange={(checked) => setFormData({ ...formData, estActif: checked })}
            />
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-slate-100">
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 shadow-lg shadow-primary/20">
              {user ? "Enregistrer les modifications" : "Créer le compte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
