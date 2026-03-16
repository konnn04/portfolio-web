import myInfo from "@/configs/my-info.json";

export function useMyInfo() {
  const { profile } = myInfo;
  return { profile };
}
