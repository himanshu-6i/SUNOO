const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldModal = `<AIChatModal onClose={() => setIsAiChatModalOpen(false)} />`;
const newModal = `<AIChatModal onClose={() => setIsAiChatModalOpen(false)} onNavigate={(v) => { setView(v as ViewState); setIsAiChatModalOpen(false); }} />`;

content = content.replace(oldModal, newModal);

fs.writeFileSync('src/App.tsx', content);
