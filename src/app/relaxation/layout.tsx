import { RelaxationShell } from "@/components/relaxation/relaxation-shell";

export default function RelaxationLayout({
  children,
}: LayoutProps<"/relaxation">) {
  return <RelaxationShell>{children}</RelaxationShell>;
}
