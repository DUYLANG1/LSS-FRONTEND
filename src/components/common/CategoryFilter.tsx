interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-3">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? "bg-blue-100 text-blue-800"
              : "hover:bg-[var(--card-border)]"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors 
                ${
                  selectedCategory === category.id
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-[var(--card-border)]"
                }`}
          >
            <span>{category.name}</span>
            <span className="float-right text-sm text-gray-500">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
