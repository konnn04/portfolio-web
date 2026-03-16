"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, List, Grid } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  const currentSortBy = searchParams.get("sortBy") || "date";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const [searchValue, setSearchValue] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(pathname + "?" + createQueryString("q", searchValue));
  };

  const handleSortChange = (value: string) => {
    const [by, order] = value.split("-");
    let qs = createQueryString("sortBy", by);
    const qsParams = new URLSearchParams(qs);
    qsParams.set("sortOrder", order);
    qs = qsParams.toString();
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", by);
    params.set("sortOrder", order);
    router.push(pathname + "?" + params.toString());
  };

  const sortValue = `${currentSortBy}-${currentSortOrder}`;

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
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
  );
}
