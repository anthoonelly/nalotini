import { Category } from "@/lib/types";
import { categoryEmoji } from "@/lib/categories";

export default function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="chip-brand">
      <span aria-hidden>{categoryEmoji(category)}</span>
      <span>{category}</span>
    </span>
  );
}
