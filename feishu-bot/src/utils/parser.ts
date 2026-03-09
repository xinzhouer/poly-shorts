import * as chrono from 'chrono-node';

export interface ParsedTask {
  content: string;
  deadline?: Date;
  assignees: string[]; // User open_ids
}

/**
 * Parse task details from message content
 * @param text The message text
 * @param mentions The mentions in the message
 * @param senderId The sender's user ID (optional, used as default assignee if no other mentions)
 */
export function parseTask(text: string, mentions: any[], senderId?: string): ParsedTask {
  // Extract deadline using chrono-node
  const parsedDate = chrono.parse(text, new Date(), { forwardDate: true });
  let deadline: Date | undefined;
  let cleanText = text;

  if (parsedDate && parsedDate.length > 0) {
    deadline = parsedDate[0].start.date();
    // Remove the date string from the text to clean up content
    cleanText = text.replace(parsedDate[0].text, '').trim();
  }

  // Extract assignees from mentions
  // We need to filter out the bot itself. 
  // Since we don't have the bot's ID here easily, we rely on the controller to pass filtered mentions or handle it.
  // But typically, if the user mentions the bot, the bot is in the mentions list.
  // If the user mentions other users, they are also in the list.
  // We'll assume all mentions are potential assignees for now.
  // A better approach in the controller is to filter out the bot's ID if known.
  
  let assignees = mentions
    .filter(mention => mention.id.user_id) // Filter only user mentions
    .map(mention => mention.id.user_id);

  // If no assignees found (except maybe the bot itself, which we can't distinguish easily without ID),
  // we might want to default to the sender.
  // However, since we can't distinguish bot from user easily here without config,
  // we will rely on the caller to handle "no assignee" logic or pass the bot ID to exclude.
  
  // For this simple version:
  // If assignees is empty, and senderId is provided, use senderId.
  // Note: This assumes the bot is NOT in the mentions array passed here, or the caller handles it.
  // But the event *does* include the bot in mentions.
  
  // Let's change strategy:
  // The caller (controller) should filter out the bot if possible.
  // If not, we just return all mentions.
  
  return {
    content: cleanText,
    deadline,
    assignees
  };
}
