import Image from "next/image";
import Link from "next/link";
import type { CategoryTile as CategoryTileType } from "@/lib/types/tenant";

interface Props {
  tile: CategoryTileType;
}

export default function CategoryTile({ tile }: Props) {
  return (
    <Link
      href={tile.link_url || "/catalogo"}
      className="relative aspect-[3/2] rounded-xl overflow-hidden group block"
    >
      <Image
        src={tile.image_url}
        alt={tile.title || "Categoria"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      {tile.title && (
        <span className="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-lg">
          {tile.title}
        </span>
      )}
    </Link>
  );
}
