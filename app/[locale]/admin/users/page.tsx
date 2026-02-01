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
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data fetching
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    createdAt: "2024-01-17",
  },
];

const UsersPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage registered users
          </p>
        </div>
        <Badge variant="outline" className="border-white/10 text-muted-foreground">
          {mockUsers.length} total
        </Badge>
      </div>

      <Card className="border-white/6">
        <CardHeader className="border-b border-white/6 pb-4">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/6 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/60">
                  Name
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/60">
                  Email
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/60">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/6 hover:bg-white/2"
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.createdAt}
                  </TableCell>
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
