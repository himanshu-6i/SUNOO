const fs = require('fs');

let content = fs.readFileSync('src/components/AIChatModal.tsx', 'utf8');

const oldInterface = `interface AIChatModalProps {
  onClose: () => void;
}`;

const newInterface = `interface AIChatModalProps {
  onClose: () => void;
  onNavigate?: (view: string) => void;
}`;

const oldExport = `export function AIChatModal({ onClose }: AIChatModalProps) {`;
const newExport = `export function AIChatModal({ onClose, onNavigate }: AIChatModalProps) {`;

const oldSetMessages = `      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.output,
        thoughts: data.thoughts
      }]);`;

const newSetMessages = `      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.output,
        thoughts: data.thoughts
      }]);
      
      if (data.navigate_to && data.navigate_to.trim() !== '') {
        setTimeout(() => {
          if (onNavigate) {
            onNavigate(data.navigate_to.trim());
          }
        }, 1500); // Small delay to let user read the message before navigating
      }`;

content = content.replace(oldInterface, newInterface);
content = content.replace(oldExport, newExport);
content = content.replace(oldSetMessages, newSetMessages);

fs.writeFileSync('src/components/AIChatModal.tsx', content);
