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
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const reports = [
    { id: 'REP-001', reportedUser: 'Test User 1', reporter: 'Jane Smith', reason: 'Inappropriate language', date: '2024-05-20', status: 'Open' },
    { id: 'REP-002', reportedUser: 'Test User 2', reporter: 'John Doe', reason: 'Spam', date: '2024-05-19', status: 'In Review' },
    { id: 'REP-003', reportedUser: 'Expert User 1', reporter: 'Admin', reason: 'Misleading profile', date: '2024-05-18', status: 'Resolved' },
    { id: 'REP-004', reportedUser: 'Test User 3', reporter: 'Test User 4', reason: 'Harassment', date: '2024-05-20', status: 'Open' },
    { id: 'REP-005', reportedUser: 'Expert User 2', reporter: 'Test User 5', reason: 'No-show for call', date: '2024-05-17', status: 'Resolved' },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">Content Moderation</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>Review and manage all user-submitted reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Reported User</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.reportedUser}</TableCell>
                  <TableCell>{report.reporter}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Open' ? 'destructive' : (report.status === 'In Review' ? 'secondary' : 'outline')}>{report.status}</Badge>
                  </TableCell>
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Mark as "In Review"</DropdownMenuItem>
                        <DropdownMenuItem>Mark as "Resolved"</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
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
