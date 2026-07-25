import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Shirt } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DeleteButton } from "./delete-button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const item = await prisma.clothingItem.findFirst({
    where: { id, userId: session.user.id },
  });
  return { title: item ? `${item.name} — WearWise` : "Item — WearWise" };
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const item = await prisma.clothingItem.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!item) notFound();

  const displayCategory =
    item.category.charAt(0).toUpperCase() + item.category.slice(1);

  return (
    <div className="max-w-[640px] mx-auto px-4 py-10">
      <Link
        href="/wardrobe"
        className="inline-flex items-center gap-1.5 text-[13px] text-ash hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        Back to wardrobe
      </Link>

      {/* Main image */}
      <div className="rounded-xl overflow-hidden border border-linen bg-canvas mb-6">
        {item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full aspect-square object-cover"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center">
            <Shirt className="w-16 h-16 text-dust/30" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {item.images.length > 1 && (
        <div className="flex gap-2 mb-6">
          {item.images.map((url, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-lg overflow-hidden border border-linen"
            >
              <img src={url} alt={`${item.name} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold text-ink tracking-tight">
            {item.name}
          </h1>
          <p
            className="mt-1 text-[12px] tracking-[0.04em] text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {item.subcategory || displayCategory}
            {item.brand && ` · ${item.brand}`}
            {item.size && ` · Size ${item.size}`}
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          {item.colors.length > 0 && (
            <div>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Colors
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.colors.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-seam text-ink border border-linen"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.seasons.length > 0 && (
            <div>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Seasons
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.seasons.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-canvas text-ink border border-linen"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.occasions.length > 0 && (
            <div>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Occasions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.occasions.map((o) => (
                  <span
                    key={o}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-canvas text-ink border border-linen"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          {item.purchasePrice != null && (
            <div>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-ash mb-0.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Price
              </p>
              <p className="text-[15px] font-medium text-ink">
                ${item.purchasePrice.toFixed(2)}
              </p>
            </div>
          )}
          {item.purchaseDate && (
            <div>
              <p
                className="text-[10px] tracking-[0.14em] uppercase text-ash mb-0.5"
                style={{ fontFamily: "var(--font-label)" }}
              >
                Purchased
              </p>
              <p className="text-[15px] font-medium text-ink">
                {new Date(item.purchaseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
          <div>
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-ash mb-0.5"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Worn
            </p>
            <p className="text-[15px] font-medium text-ink">
              {item.wearCount} {item.wearCount === 1 ? "time" : "times"}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-ash mb-0.5"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Added
            </p>
            <p className="text-[15px] font-medium text-ink">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div>
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-ash mb-1"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Notes
            </p>
            <p className="text-[14px] text-ink leading-relaxed">{item.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/wardrobe/${item.id}/edit`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-rose text-paper text-[13px] font-medium hover:bg-crimson transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
            Edit
          </Link>
          <DeleteButton id={item.id} name={item.name} />
        </div>
      </div>
    </div>
  );
}
