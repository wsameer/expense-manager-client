import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const SearchSection = () => {
  return (
    <form className="ml-auto w-full sm:flex-initial">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 rounded-full"
        />
      </div>
    </form>
  );
};
