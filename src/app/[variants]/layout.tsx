export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ variants: string }>;
}) {
  const { variants } = await params;

  return <div>{variants}</div>;
}
