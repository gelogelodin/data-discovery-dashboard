import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Data Discovery Dashboard',
  description: 'Dashboard for managing data deletion requests.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
