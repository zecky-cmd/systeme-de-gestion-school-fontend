import api from "@/lib/axios";
import { Matiere } from "./matiere.service";
import { Classe } from "./classe.service";
import { MatiereNiveau } from "./matiere-niveau.service";

export interface SubjectCoefficient {
  id: number;
  matiere: string;
  code: string;
  groupe: string;
  coefficients: Record<string, number>;
}

export interface PedagogyData {
  subjects: SubjectCoefficient[];
  levels: string[];
}

export interface NoteType {
  id: string;
  label: string;
  weight: number;
  color: string;
}

export const PedagogyService = {
  getPedagogyData: async (): Promise<PedagogyData> => {
    const [matieresRes, classesRes, matiereNiveauxRes] = await Promise.all([
      api.get<Matiere[]>("/matiere"),
      api.get<Classe[]>("/classe"),
      api.get<MatiereNiveau[]>("/matiere-niveau")
    ]);

    const matieres = matieresRes.data;
    const classes = classesRes.data;
    const matiereNiveaux = matiereNiveauxRes.data;

    // Extraire les niveaux uniques présents dans l'école
    const levels = Array.from(new Set(classes.map(c => c.niveau).filter(Boolean))).sort();

    const subjects = matieres.map(m => {
      const coefs: Record<string, number> = {};
      
      matiereNiveaux
        .filter(mn => mn.matiereId === m.id)
        .forEach(mn => {
          const classe = classes.find(c => c.id === mn.classeId);
          if (classe && classe.niveau) {
            coefs[classe.niveau] = mn.coefficient;
          }
        });

      return {
        id: m.id,
        matiere: m.nom,
        code: m.code,
        groupe: "Général",
        coefficients: coefs
      };
    });

    return { subjects, levels };
  },

  getNoteTypes: async (): Promise<NoteType[]> => {
    try {
      const response = await api.get("/pedagogy/note-types");
      return response.data;
    } catch {
      return [
        { id: "1", label: "Interrogation", weight: 1, color: "amber" },
        { id: "2", label: "Devoir Surveille (DS)", weight: 2, color: "blue" },
        { id: "3", label: "Composition", weight: 3, color: "emerald" }
      ];
    }
  },

  updateAllCoefficients: async (subjects: SubjectCoefficient[]): Promise<void> => {
    const classesRes = await api.get<Classe[]>("/classe");
    const classes = classesRes.data;
    const updates: Promise<any>[] = [];

    for (const s of subjects) {
      for (const [niveau, coef] of Object.entries(s.coefficients)) {
        const levelClasses = classes.filter(c => c.niveau === niveau);
        for (const cls of levelClasses) {
          updates.push(api.post("/matiere-niveau", {
            classeId: cls.id,
            matiereId: s.id,
            coefficient: coef,
            noteMax: 20
          }).catch(() => {
            // Si doublon, on pourrait faire un PATCH ici via l'ID mn
          }));
        }
      }
    }
    await Promise.all(updates);
  },

  updateAllNoteTypes: async (noteTypes: NoteType[]): Promise<void> => {
    console.log("Saving note types:", noteTypes);
  }
};
