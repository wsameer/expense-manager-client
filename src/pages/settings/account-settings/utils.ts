import { Account } from '@/store/accountsStore';

export const getUniqueGroups = (accounts: Account[]): string[] => {
  const uniqueGroups: string[] = [];
  const seenGroups: Set<string> = new Set();

  for (const account of accounts) {
    if (!seenGroups.has(account.group)) {
      uniqueGroups.push(account.group);
      seenGroups.add(account.group);
    }
  }

  return uniqueGroups;
};
