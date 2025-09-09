'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-provider";
import { activities } from "@/lib/data";
import { Activity, Users, BarChart2, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const recentActivities = activities.slice(0, 5);

  const stats = [
    { title: t('Total Activities', 'إجمالي الأنشطة'), value: activities.length, icon: Activity, color: 'text-blue-500' },
    { title: t('Total Registrations', 'إجمالي التسجيلات'), value: 125, icon: Users, color: 'text-green-500' },
    { title: t('Events Hosted', 'الفعاليات المستضافة'), value: activities.filter(a => a.category === 'Event').length, icon: BarChart2, color: 'text-purple-500' },
    { title: t('Total Revenue', 'إجمالي الإيرادات'), value: `$${activities.reduce((sum, a) => sum + (a.cost || 0) * 5, 0)}`, icon: DollarSign, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('Admin Dashboard', 'لوحة تحكم المسؤول')}
        </h1>
        <p className="text-muted-foreground">
          {t('Welcome back, Admin!', '!مرحبا بعودتك يا مسؤول')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('Recent Activities', 'الأنشطة الأخيرة')}</CardTitle>
          <CardDescription>{t('A list of the most recently added activities.', 'قائمة بالأنشطة المضافة مؤخرًا.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Activity', 'النشاط')}</TableHead>
                <TableHead>{t('Category', 'الفئة')}</TableHead>
                <TableHead>{t('Date', 'التاريخ')}</TableHead>
                <TableHead className="text-right">{t('Cost', 'التكلفة')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    {language === 'en' ? activity.title : activity.titleAr}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{activity.category}</Badge>
                  </TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell className="text-right">
                    {activity.cost ? `$${activity.cost}` : 'Free'}
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
