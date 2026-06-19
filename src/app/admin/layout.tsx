import AdminLayoutWrapper from "../../components/AdminLayoutWrapper";
import "./admin.module.css";

export const metadata = {
  title: "Admin Dashboard - H-N Laboratory",
  description: "Content Management System for H-N Laboratory",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
