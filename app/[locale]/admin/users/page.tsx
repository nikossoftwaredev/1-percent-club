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
import { prisma } from "@/lib/db";

const UsersPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
          {users.length} total
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
                  Role
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/60">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-white/6 hover:bg-white/2"
                >
                  <TableCell className="font-medium">
                    {user.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.role === "ADMIN"
                          ? "border-yellow-500/30 text-yellow-400"
                          : user.role === "MODERATOR"
                            ? "border-blue-500/30 text-blue-400"
                            : "border-white/10 text-muted-foreground"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.createdAt.toLocaleDateString()}
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
