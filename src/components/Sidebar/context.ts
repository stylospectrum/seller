import { createContext } from 'react';

interface SidebarContextProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  onSelect: () => {},
  selectedId: '',
});

export default SidebarContext;
