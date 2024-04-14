export type Shortcut = {
  id: string;
  action: string;
  Keys: string;
  execute: () => void;
  IconPath?: string;  // Optional property for the path to the shortcut's icon
};

