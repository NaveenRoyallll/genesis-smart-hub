
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Save, X } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface NoteTakingProps {
  isActive: boolean;
  onClose: () => void;
}

const NoteTaking: React.FC<NoteTakingProps> = ({ isActive, onClose }) => {
  const [notes, setNotes] = useState<string>('');
  const { toast } = useToast();
  
  // Load saved notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem('ai_assistant_notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);
  
  const handleSaveNotes = () => {
    localStorage.setItem('ai_assistant_notes', notes);
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully",
    });
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed top-20 right-5 rounded-lg shadow-lg overflow-hidden bg-card border border-border/40 w-72">
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-muted/30">
        <h3 className="font-medium">Notes</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes here..."
          className="min-h-[200px] resize-none border-border/30"
        />
        
        <div className="flex justify-end mt-3">
          <Button 
            variant="default"
            size="sm"
            onClick={handleSaveNotes}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteTaking;
