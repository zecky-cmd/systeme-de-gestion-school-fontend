import { Plus, X } from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COLLEGE_LEVEL_IDENTIFIERS } from "./constants";

interface LevelsCardProps {
  levels: string[];
  onAddClick: () => void;
  onDeleteLevel: (level: string) => void;
}

export function LevelsCard({
  levels,
  onAddClick,
  onDeleteLevel
}: LevelsCardProps) {
  const collegeLevels = levels.filter(l => 
    COLLEGE_LEVEL_IDENTIFIERS.some(id => l.toLowerCase().includes(id.toLowerCase()))
  );
  const lyceeLevels = levels.filter(l => !collegeLevels.includes(l));

  return (
    <Card className="border-[oklch(0.91_0.005_240)] shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 font-heading">Niveaux et classes</CardTitle>
            <CardDescription className="text-sm">Gérez les niveaux qui apparaissent dans le tableau des coefficients</CardDescription>
          </div>
          <Button 
            onClick={onAddClick}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 rounded-xl"
          >
            <Plus size={18} />
            Ajouter un niveau
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">1er Cycle</h4>
          <div className="flex flex-wrap gap-2">
            {collegeLevels.map(l => (
              <div key={l} className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold transition-all hover:border-emerald-200 hover:bg-emerald-50">
                {l}
                <button 
                  onClick={() => onDeleteLevel(l)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {collegeLevels.length === 0 && <span className="text-xs italic text-slate-400">Aucun niveau configuré</span>}
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">2nd Cycle</h4>
          <div className="flex flex-wrap gap-2">
            {lyceeLevels.map(l => (
              <div key={l} className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold transition-all hover:border-emerald-200 hover:bg-emerald-50">
                {l}
                <button 
                  onClick={() => onDeleteLevel(l)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {lyceeLevels.length === 0 && <span className="text-xs italic text-slate-400">Aucun niveau configuré</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
