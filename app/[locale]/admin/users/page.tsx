import { setRequestLocale } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasePageProps } from "@/types/page-props";
import { TypographyH2 } from "@/components/ui/typography";

// Mock data - replace with actual data fetching
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", createdAt: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", createdAt: "2024-01-16" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", createdAt: "2024-01-17" },
];

const UsersPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <TypographyH2>Users</TypographyH2>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
