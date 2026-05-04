import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FinanceService } from "@/services/finance.service";
import { toast } from "sonner";

export function useFinance() {
  const queryClient = useQueryClient();

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ["finance-fees"],
    queryFn: FinanceService.getFees
  });

  const updateFeeMutation = useMutation({
    mutationFn: ({ id, level, price }: { id: number; level: string; price: number }) => 
      FinanceService.updateFee(id, level, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance-fees"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du tarif");
    }
  });

  return {
    fees,
    isLoading,
    updateFee: (id: number, level: string, price: number) => 
      updateFeeMutation.mutate({ id, level, price })
  };
}
