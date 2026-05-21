interface QueryErrorStateProps {
  message?: string;
}

export function QueryErrorState({
  message = "Erreur lors du chargement des données.",
}: QueryErrorStateProps) {
  return (
    <div className="p-8 text-center text-red-500">{message}</div>
  );
}
