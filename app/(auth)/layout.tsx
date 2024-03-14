export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[600px] sm:h-full flex items-center justify-center">
      {children}
    </div>
  );
}
