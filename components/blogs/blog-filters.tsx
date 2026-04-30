"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, List, Grid, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/providers";

interface BlogFiltersProps {
  viewMode: "list" | "card";
  setViewMode: (mode: "list" | "card") => void;
}

export function BlogFilters({ viewMode, setViewMode }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSortBy = searchParams.get("sortBy") || "date";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const [searchValue, setSearchValue] = useState(currentSearch);

  const buildPath = (params: URLSearchParams) =>
    `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(buildPath(params));
  };

  const handleClearCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("page");
    router.push(buildPath(params));
  };

  const handleClearTag = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    params.delete("page");
    router.push(buildPath(params));
  };

  const handleSortChange = (value: string) => {
    const [by, order] = value.split("-");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", by);
    params.set("sortOrder", order);
    router.push(buildPath(params));
  };

  const sortValue = `${currentSortBy}-${currentSortOrder}`;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full md:max-w-md flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("blogs.search_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-4"
          />
          <Button type="submit" variant="secondary" className="ml-2">
            {t("blogs.search_button")}
          </Button>
        </form>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={sortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("blogs.sort_by")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">{t("blogs.sort_newest")}</SelectItem>
              <SelectItem value="date-asc">{t("blogs.sort_oldest")}</SelectItem>
              <SelectItem value="name-asc">{t("blogs.sort_name_asc")}</SelectItem>
              <SelectItem value="name-desc">{t("blogs.sort_name_desc")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md p-1 bg-muted/50">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-sm ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-sm ${viewMode === "card" ? "bg-background shadow-sm" : ""}`}
              onClick={() => setViewMode("card")}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {currentCategory && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("blogs.category_label")}</span>
          <Badge className="inline-flex items-center gap-2 rounded-full bg-background/80 border border-primary/20 px-3 py-1 text-sm text-primary">
            {currentCategory}
            <X className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={handleClearCategory} />
          </Badge>
        </div>
      )}

      {currentTag && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("blogs.tag_label")}</span>
          <Badge className="inline-flex items-center gap-2 rounded-full bg-background/80 border border-primary/20 px-3 py-1 text-sm text-primary">
            {currentTag}
            <X className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={handleClearTag} />
          </Badge>
        </div>
      )}
    </div>
  );
}
