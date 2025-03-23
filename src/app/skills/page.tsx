"use client";
import SearchBar from "@/components/common/SearchBar";
import CategoryFilter from "@/components/common/CategoryFilter";
import SkillList from "@/components/skills/SkillList";

export default function SkillsPage() {
  // In a real app, these would come from your backend
  const mockCategories = [
    { id: "1", name: "Programming", count: 15 },
    { id: "2", name: "Design", count: 10 },
    { id: "3", name: "Language", count: 8 },
    { id: "4", name: "Music", count: 12 },
  ];

  return (
    <div className="grid grid-cols-4 gap-12">
      <div className="col-span-1">
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategorySelect={(id) => console.log("Selected category:", id)}
        />
      </div>
      <div className="col-span-3 ml-20">
        <div className="mb-6">
          <SearchBar
            onSearch={(query) => console.log("Search query:", query)}
          />
        </div>
        <SkillList skills={[]} /> {/* Add your skills data here */}
      </div>
    </div>
  );
}
