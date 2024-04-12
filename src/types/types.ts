export type Shortcut = {
  id: string;
  action: string;
  Keys: string; // Keeping the "Keys" property
  execute: () => void;
};
