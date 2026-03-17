import myInfo from "@/configs/data/my-info.json";

export function useMyInfo() {
  const { profile } = myInfo;
  return { profile };
}
