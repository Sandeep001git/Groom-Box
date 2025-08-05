import AdminPanelLayout from "@/components/admin/admin-layout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminPanelLayout>
        {children}
        </AdminPanelLayout>
        </body>
    </html>
  );
}
