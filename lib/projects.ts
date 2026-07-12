import type { Project } from "@/types/project";

/** Default ordering: pinned first, then most-recent joinAt. */
export function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => {
    if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
    return new Date(b.joinAt).getTime() - new Date(a.joinAt).getTime();
  });
}
