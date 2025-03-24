"use client";
import { useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import CategoryFilter from "@/components/common/CategoryFilter";
import { SkillList } from "@/components/skills/SkillList";

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 gap-12">
      <div className="col-span-1">
        <CategoryFilter
          categories={[
            { id: "programming", name: "Programming", count: 15 },
            { id: "design", name: "Design", count: 10 },
            { id: "languages", name: "Languages", count: 8 },
            { id: "music", name: "Music", count: 12 },
          ]}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>
      <div className="col-span-3">
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <SkillList searchQuery={searchQuery} category={selectedCategory} />
      </div>
    </div>
  );
}
