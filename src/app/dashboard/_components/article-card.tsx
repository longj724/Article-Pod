import { Article } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  isSelected?: boolean;
  onDelete: () => void;
}

const ArticleCard = ({
  article,
  onClick,
  isSelected,
  onDelete,
}: ArticleCardProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card onClick from firing
    onDelete();
  };

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-colors relative
        ${isSelected ? 'bg-primary/5 border-primary/50' : 'hover:bg-muted/50'}`}
      onClick={onClick}
    >
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={(e) => e.stopPropagation()} // Prevent card click when opening menu
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleDeleteClick}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-medium mb-2 pr-8">{article.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {article.content_url}
      </p>
    </div>
  );
};

export default ArticleCard;
