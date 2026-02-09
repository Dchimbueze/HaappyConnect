import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const users = [
    { id: 'USR-001', name: 'John Doe', email: 'john.d@example.com', role: 'Seeker', joined: '2023-10-26', status: 'Active' },
    { id: 'USR-002', name: 'Dr. Evelyn Reed', email: 'e.reed@example.com', role: 'Expert', joined: '2023-01-15', status: 'Active' },
    { id: 'USR-003', name: 'Jane Smith', email: 'jane.s@example.com', role: 'Seeker', joined: '2023-11-01', status: 'Suspended' },
    { id: 'USR-004', name: 'Marcus Chen', email: 'm.chen@example.com', role: 'Expert', joined: '2023-03-22', status: 'Active' },
    { id: 'USR-005', name: 'Aisha Khan', email: 'a.khan@example.com', role: 'Expert', joined: '2022-12-30', status: 'Active' },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Browse and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                         <AvatarImage src={`https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} data-ai-hint="person avatar" />
                         <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Expert' ? 'default' : 'outline'}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
