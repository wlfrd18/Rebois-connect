import React from "react";
import TimelineCard from "./TimelineCard";

export default function Timeline({ items = [], currentUser }) {
  // Filtrer les lands sponsorisés, c’est-à-dire ceux qui ont un projet lié
  const filteredItems = items.filter((item) => {
    // Si c’est un land (propriétaire défini)
    if (item.owner_id) {
      // Chercher s’il y a un projet sponsorisé dans la liste qui fait référence à ce land
      const hasProjectForLand = items.some(
        (i) => i.sponsor_id && i.land && i.land.id === item.id
      );
      // On exclut le land si un projet sponsorisé existe pour lui
      return !hasProjectForLand;
    }
    // Sinon on garde l’item (projets, etc)
    return true;
  });

  return (
    <div className="flex flex-col gap-6 overflow-y-auto max-h-screen px-4 py-6">
      {filteredItems.map((item) => (
        <TimelineCard
          key={`item-${item.id}-${item.status}`}
          item={item}
          currentUser={currentUser}
          isSponsorDashboard={currentUser?.role === "sponsor" || currentUser?.role === "superuser"}
        />
      ))}
    </div>
  );
}
