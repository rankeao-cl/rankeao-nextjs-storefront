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
      className="relative aspect-[16/9] sm:aspect-[4/3] rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300 block"
    >
      <Image
        src={tile.image_url}
        alt={tile.title || "Categoria"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      {tile.title && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <span className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
            {tile.title}
          </span>
        </div>
      )}
    </Link>
  );
}
