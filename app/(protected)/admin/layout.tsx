import Guard from "@/components/admin/Guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Guard>{children}</Guard>;
}
