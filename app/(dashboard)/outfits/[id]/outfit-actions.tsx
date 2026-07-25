"use client";

import { useState } from "react";
import { Star, Trash2, CalendarCheck, Pencil, Loader2 } from "lucide-react";
import { toggleFavorite, deleteOutfit, logOutfitWear } from "@/actions/outfit";
import Link from "next/link";

export function OutfitActions({
  outfitId,
  isFavorite,
}: {
  outfitId: string;
  isFavorite: boolean;
}) {
  const [fav, setFav] = useState(isFavorite);
  const [showDelete, setShowDelete] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logged, setLogged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFavorite = async () => {
    const result = await toggleFavorite(outfitId);
    setFav(result.isFavorite);
  };

  const handleLogWear = async () => {
    setIsLogging(true);
    await logOutfitWear(outfitId);
    setLogged(true);
    setIsLogging(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteOutfit(outfitId);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogWear}
        disabled={isLogging || logged}
        className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-[13px] font-medium transition-all ${
          logged
            ? "bg-rose/10 text-rose border border-rose/20"
            : "bg-rose text-paper hover:bg-crimson"
        } disabled:opacity-50`}
      >
        {isLogging ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <CalendarCheck className="w-3.5 h-3.5" strokeWidth={2} />
        )}
        {logged ? "Logged!" : "Log wear"}
      </button>

      <button
        onClick={handleFavorite}
        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
          fav
            ? "border-rose bg-rose/5 text-rose"
            : "border-linen bg-paper text-ash hover:text-ink hover:border-dust"
        }`}
        title={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Star
          className="w-4 h-4"
          strokeWidth={1.75}
          fill={fav ? "currentColor" : "none"}
        />
      </button>

      <Link
        href={`/outfits/${outfitId}/edit`}
        className="w-9 h-9 rounded-lg border border-linen bg-paper flex items-center justify-center text-ash hover:text-ink hover:border-dust transition-all"
        title="Edit outfit"
      >
        <Pencil className="w-4 h-4" strokeWidth={1.75} />
      </Link>

      {showDelete ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-9 px-3 rounded-lg bg-crimson text-paper text-[13px] font-medium hover:bg-crimson/80 disabled:opacity-50 transition-all"
          >
            {isDeleting ? "..." : "Yes"}
          </button>
          <button
            onClick={() => setShowDelete(false)}
            className="h-9 px-3 rounded-lg border border-linen text-ink text-[13px] font-medium hover:bg-canvas transition-all"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowDelete(true)}
          className="w-9 h-9 rounded-lg border border-linen bg-paper flex items-center justify-center text-ash hover:text-crimson hover:border-crimson/30 hover:bg-crimson/5 transition-all"
          title="Delete outfit"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
