import type { LucideProps } from 'lucide-react';
import { Home, User, UserCog, FileUp } from 'lucide-react';

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 12h3v10h14V12h3L12 2z" />
      <path d="M12 10v12" />
      <path d="M16 16h-8" />
      <path d="M16 22h-8" />
      <path d="M16 10h-8" />
    </svg>
  ),
  owner: (props: LucideProps) => <UserCog {...props} className="text-primary"/>,
  tenant: (props: LucideProps) => <User {...props} className="text-accent"/>,
  upload: (props: LucideProps) => <FileUp {...props} />,
};
