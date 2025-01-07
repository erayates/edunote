import { searchGroups } from "@/actions/groups";
import GroupsContainer from "@/containers/groups-container";
import { notFound } from "next/navigation";
import { GroupWithRelations } from "@/types/group";

interface SearchParams {
  search?: string;
  tags?: string;
  author?: string;
  createdAt?: string;
  page?: number;
}

interface GroupsPageParams {
  searchParams: Promise<SearchParams>;
}

const LIMIT = 12;

export default async function GroupsPage({ searchParams }: GroupsPageParams) {
  const { search, page = 1 } = await searchParams;

  const searchResult = await searchGroups({
    query: search as string,
    page: Number(page),
    limit: LIMIT,
  });

  if (!searchResult || !searchResult.groups) {
    return notFound();
  }

  return (
    <GroupsContainer
      groups={searchResult.groups as GroupWithRelations[]}
      totalNotes={searchResult.totalGroups ?? 0}
    />
  );
}
