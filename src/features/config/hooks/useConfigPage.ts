import { useState } from "react";
import { ConfigTab } from "../constants/config.constants";

export function useConfigPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("etablissement");

  return {
    activeTab,
    setActiveTab
  };
}
