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
import { Users, UserPlus, Flag, DollarSign } from 'lucide-react';

const stats = [
  { title: 'Total Users', value: '1,254', icon: Users, change: '+20.1% from last month' },
  { title: 'New Experts', value: '+32', icon: UserPlus, change: '+15 this month' },
  { title: 'Open Reports', value: '12', icon: Flag, change: '3 new reports today' },
  { title: 'Total Revenue', value: '$45,231.89', icon: DollarSign, change: '+180.1% from last month' },
];

const recentReports = [
    { id: 'REP-001', user: 'Test User 1', reason: 'Inappropriate language', status: 'Open' },
    { id: 'REP-002', user: 'Test User 2', reason: 'Spam', status: 'In Review' },
    { id: 'REP-003', user: 'Expert User 1', reason: 'Misleading profile', status: 'Resolved' },
    { id: 'REP-004', user: 'Test User 3', reason: 'Harassment', status: 'Open' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>A list of the most recent user-submitted reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Reported User</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.user}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'Open' ? 'destructive' : 'secondary'}>{report.status}</Badge>
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
