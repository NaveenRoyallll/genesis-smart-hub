
import React from 'react';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from './ui/drawer';
import { Button } from './ui/button';
import { Trash2, Clock, Plus } from 'lucide-react';
import { ChatHistory } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  histories: ChatHistory[];
  onSelectHistory: (history: ChatHistory) => void;
  onDeleteHistory: (historyId: string) => void;
  onNewChat: () => void;
}

const ChatHistoryDrawer: React.FC<ChatHistoryDrawerProps> = ({
  isOpen,
  onClose,
  histories,
  onSelectHistory,
  onDeleteHistory,
  onNewChat
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-card text-card-foreground">
        <DrawerHeader className="border-b border-border/40">
          <DrawerTitle className="text-primary">Conversation History</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full mb-4 flex items-center justify-center gap-2"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4" /> New Conversation
          </Button>
          
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2 pr-2">
              {histories.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No conversation history yet
                </div>
              ) : (
                histories.map((history) => (
                  <div 
                    key={history.id} 
                    className="flex items-center justify-between bg-muted/30 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => onSelectHistory(history)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium truncate">{history.title}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(history.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistory(history.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DrawerFooter className="border-t border-border/40">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatHistoryDrawer;
