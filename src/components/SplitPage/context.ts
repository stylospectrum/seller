import { createContext } from 'react';

interface SplitPageContextProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SplitPageContext = createContext<SplitPageContextProps>({
  collapsed: false,
  toggleCollapse: () => {},
});

export default SplitPageContext;
