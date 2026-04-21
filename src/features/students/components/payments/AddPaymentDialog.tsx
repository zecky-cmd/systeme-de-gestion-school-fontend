"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RubriqueService } from "@/services/rubrique.service";
import { PaiementService, ModePaiement } from "@/services/paiement.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";

const paymentSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  rubriqueId: z.string().min(1, "La rubrique est requise"),
  mode: z.enum(["esp", "mobile", "cheque"]),
  datePaiement: z.string(),
  reference: z.string().optional(),
  commentaire: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface AddPaymentDialogProps {
  eleveId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentDialog({ eleveId, open, onOpenChange }: AddPaymentDialogProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const { data: rubriques } = useQuery({
    queryKey: ["rubriques"],
    queryFn: () => RubriqueService.getAll(),
    enabled: open,
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      montant: "",
      rubriqueId: "",
      mode: "esp",
      datePaiement: new Date().toISOString().split('T')[0],
      reference: "",
      commentaire: "",
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      if (!user?.id) throw new Error("Utilisateur non authentifié");

      await PaiementService.create({
        eleveId,
        montant: parseInt(data.montant),
        rubriqueId: parseInt(data.rubriqueId),
        mode: data.mode as ModePaiement,
        encaisseParId: user.id,
        reference: data.reference,
      });

      toast.success("Paiement enregistré avec succès !");
      void queryClient.invalidateQueries({ queryKey: ["payment-history", eleveId] });
      void queryClient.invalidateQueries({ queryKey: ["finance-situation", eleveId] });
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error("Échec de l'enregistrement: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CreditCard size={20} />
            <DialogTitle className="text-xl font-bold">Enregistrer un versement</DialogTitle>
          </div>
          <DialogDescription>
            Saisissez les détails du paiement reçu pour cet élève.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant" className="text-xs font-bold uppercase">Montant (CFA)</Label>
              <Input 
                id="montant" 
                placeholder="50000" 
                type="number" 
                {...register("montant")} 
                className="h-10 font-bold text-lg" 
              />
              {errors.montant && <p className="text-[10px] text-red-500 font-bold">{errors.montant.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="datePaiement" className="text-xs font-bold uppercase">Date</Label>
               <Input 
                  id="datePaiement"
                  type="date" 
                  {...register("datePaiement")} 
                  className="h-10" 
                />
               {errors.datePaiement && <p className="text-[10px] text-red-500 font-bold">{errors.datePaiement.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Rubrique</Label>
            <Select 
              value={watch("rubriqueId") || undefined} 
              onValueChange={(val) => val && setValue("rubriqueId", val, { shouldValidate: true })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sélectionner une rubrique" />
              </SelectTrigger>
              <SelectContent>
                {rubriques?.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>{r.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rubriqueId && <p className="text-[10px] text-red-500 font-bold">{errors.rubriqueId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase">Mode de Paiement</Label>
            <Select 
              value={watch("mode") || undefined} 
              onValueChange={(val: any) => val && setValue("mode", val, { shouldValidate: true })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="esp">Espèces</SelectItem>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
              </SelectContent>
            </Select>
            {errors.mode && <p className="text-[10px] text-red-500 font-bold">{errors.mode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference" className="text-xs font-bold uppercase tracking-wider">Référence / Reçu #</Label>
            <Input 
              id="reference" 
              placeholder="Ex: RCP-00123" 
              {...register("reference")} 
              className="h-10" 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base font-bold text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Valider le versement"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
