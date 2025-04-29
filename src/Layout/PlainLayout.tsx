// src/layouts/PlainLayout.tsx

import { ReactNode } from 'react';

const PlainLayout = ({ children }: { children: ReactNode }) => {
  return <main>{children}</main>;
};

export default PlainLayout;
