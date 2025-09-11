
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-provider";
import type { Activity, TalentedStudent, Registration, FaqItem } from "@/lib/types";
import { Users, PlusCircle, Edit, Trash2, Mail, Star, CheckSquare, XSquare, UserPlus, CheckCircle, MessageSquareQuestion } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ActivityForm } from "@/components/activity-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TalentedStudentForm } from "@/components/talented-student-form";
import { FaqForm } from "@/components/faq-form";
import { useData } from "@/contexts/data-provider";
import { useAuth } from "@/contexts/auth-provider";
import { EmailTemplates } from "@/lib/email-service";


export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const {
    activities,
    registrations,
    talentedStudents,
    faqItems,
    addActivity,
    updateActivity,
    deleteActivity,
    addTalentedStudent,
    updateTalentedStudent,
    deleteTalentedStudent,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
  } = useData();
  const { getAllUsers } = useAuth();
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  
  const [selectedTalentedStudent, setSelectedTalentedStudent] = useState<TalentedStudent | null>(null);
  const [isTalentedStudentFormOpen, setIsTalentedStudentFormOpen] = useState(false);
  
  const [selectedFaqItem, setSelectedFaqItem] = useState<FaqItem | null>(null);
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);

  const [confirmedRegistrations, setConfirmedRegistrations] = useState<string[]>([]);
  const [welcomedUsers, setWelcomedUsers] = useState<string[]>([]);
  
  const allUsers = getAllUsers();

  const stats = [
    { title: t('Total Activities', 'إجمالي الأنشطة'), value: activities.length, icon: PlusCircle, color: 'text-blue-500' },
    { title: t('Site Members', 'أعضاء الموقع'), value: allUsers.length, icon: UserPlus, color: 'text-indigo-500' },
    { title: t('Talented Students', 'الطلاب الموهوبون'), value: talentedStudents.length, icon: Star, color: 'text-yellow-500' },
    { title: t('Chatbot Q&As', 'أسئلة الشات بوت'), value: faqItems.length, icon: MessageSquareQuestion, color: 'text-purple-500' },
  ];
  
  // Activity Handlers
  const handleAddNewActivity = () => {
    setSelectedActivity(null);
    setIsActivityFormOpen(true);
  };
  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityFormOpen(true);
  };
  const handleDeleteActivity = (id: string) => {
    deleteActivity(id);
  };
  const handleActivityFormSubmit = (values: Omit<Activity, 'id'>) => {
     if (selectedActivity) {
      updateActivity(selectedActivity.id, values);
    } else {
      addActivity(values);
    }
    setIsActivityFormOpen(false);
  };

  // Talented Student Handlers
  const handleAddNewTalentedStudent = () => {
    setSelectedTalentedStudent(null);
    setIsTalentedStudentFormOpen(true);
  }
  const handleEditTalentedStudent = (student: TalentedStudent) => {
    setSelectedTalentedStudent(student);
    setIsTalentedStudentFormOpen(true);
  };
  const handleDeleteTalentedStudent = (id: string) => {
    deleteTalentedStudent(id);
  };
  const handleTalentedStudentFormSubmit = (values: Omit<TalentedStudent, 'id'>) => {
    if (selectedTalentedStudent) {
      updateTalentedStudent(selectedTalentedStudent.id, values);
    } else {
      addTalentedStudent(values);
    }
    setIsTalentedStudentFormOpen(false);
  };
  
   // FAQ Handlers
  const handleAddNewFaq = () => {
    setSelectedFaqItem(null);
    setIsFaqFormOpen(true);
  };
  const handleEditFaq = (faq: FaqItem) => {
    setSelectedFaqItem(faq);
    setIsFaqFormOpen(true);
  };
  const handleDeleteFaq = (id: string) => {
    deleteFaqItem(id);
  };
  const handleFaqFormSubmit = (values: Omit<FaqItem, 'id'>) => {
    if (selectedFaqItem) {
      updateFaqItem(selectedFaqItem.id, values);
    } else {
      addFaqItem(values);
    }
    setIsFaqFormOpen(false);
  };

  const generateMailtoLink = (to: string, subject: string, body: string) => {
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const handleWelcomeEmail = (user: { uid: string; displayName: string | null; email: string | null; }) => {
    if (!user.email || !user.displayName) return;
    const template = EmailTemplates.welcome({ userName: user.displayName });
    window.location.href = generateMailtoLink(user.email, template.subject, template.body);
    setWelcomedUsers(prev => [...prev, user.uid]);
  };

  const handleConfirmationEmail = (registration: Registration) => {
    const activity = activities.find(a => a.id === registration.activityId);
    if (!activity) return;

    const template = EmailTemplates.registrationConfirmation({
      activityTitleEn: activity.title,
      activityTitleAr: activity.titleAr
    });
    
    window.location.href = generateMailtoLink(registration.email, template.subject, template.body);
    setConfirmedRegistrations(prev => [...prev, registration.id]);
  };


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

       <div className="grid gap-8 lg:grid-cols-2">
            <Dialog open={isActivityFormOpen} onOpenChange={setIsActivityFormOpen}>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Manage Activities', 'إدارة الأنشطة')}</CardTitle>
                        <CardDescription>{t('Add, edit, or remove school activities.', 'إضافة أو تعديل أو حذف أنشطة المدرسة.')}</CardDescription>
                    </div>
                    <Button onClick={handleAddNewActivity}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('Add New Activity', 'إضافة نشاط جديد')}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('Activity', 'النشاط')}</TableHead>
                        <TableHead>{t('Category', 'الفئة')}</TableHead>
                        <TableHead>{t('In Slider?', 'في السلايدر؟')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="font-medium">
                            {language === 'en' ? activity.title : activity.titleAr}
                            </TableCell>
                            <TableCell><Badge variant="outline">{activity.category}</Badge></TableCell>
                            <TableCell>
                                {activity.showInSlider ? <CheckSquare className="h-5 w-5 text-green-500" /> : <XSquare className="h-5 w-5 text-muted-foreground" />}
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditActivity(activity)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t('Are you sure?', 'هل أنت متأكد؟')}</AlertDialogTitle>
                                        <AlertDialogDescription>{t('This action will permanently delete the activity.', 'سيؤدي هذا إلى حذف النشاط نهائيًا.')}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('Cancel', 'إلغاء')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteActivity(activity.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete', 'حذف')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">
                        {selectedActivity ? t('Edit Activity', 'تعديل النشاط') : t('Add New Activity', 'إضافة نشاط جديد')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Fill in the details below. Click save when you are done.', 'املأ التفاصيل أدناه. انقر على "حفظ" عند الانتهاء.')}
                    </DialogDescription>
                    </DialogHeader>
                    <ActivityForm activity={selectedActivity} onSubmit={handleActivityFormSubmit} onCancel={() => setIsActivityFormOpen(false)} />
                </DialogContent>
            </Dialog>
            <Dialog open={isTalentedStudentFormOpen} onOpenChange={setIsTalentedStudentFormOpen}>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                    <CardTitle>{t('Manage Talented Students', 'إدارة الطلاب الموهوبين')}</CardTitle>
                    <CardDescription>{t('Add, edit, or remove talented students.', 'إضافة أو تعديل أو حذف الطلاب الموهوبين.')}</CardDescription>
                    </div>
                    <Button onClick={handleAddNewTalentedStudent}>
                    <Star className="mr-2 h-4 w-4" />
                    {t('Add Talented Student', 'إضافة طالب موهوب')}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('Student Name', 'اسم الطالب')}</TableHead>
                        <TableHead>{t('Talent', 'الموهبة')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {talentedStudents.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell className="font-medium flex items-center gap-3">
                                <Avatar className="h-9 w-9"><AvatarImage src={student.imageUrl} data-ai-hint={student.imageHint}/><AvatarFallback>{language === 'en' ? student.name.charAt(0) : student.nameAr.charAt(0)}</AvatarFallback></Avatar>
                                {language === 'en' ? student.name : student.nameAr}
                            </TableCell>
                            <TableCell><Badge variant="secondary">{language === 'en' ? student.talent : student.talentAr}</Badge></TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditTalentedStudent(student)}>
                                <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('Are you sure?', 'هل أنت متأكد؟')}</AlertDialogTitle>
                                    <AlertDialogDescription>{t('This will permanently remove the student from the talented list.', 'سيؤدي هذا إلى إزالة الطالب نهائيًا من قائمة الموهوبين.')}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>{t('Cancel', 'إلغاء')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteTalentedStudent(student.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete', 'حذف')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
                <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">
                    {selectedTalentedStudent ? t('Edit Talented Student', 'تعديل طالب موهوب') : t('Add New Talented Student', 'إضافة طالب موهوب جديد')}
                    </DialogTitle>
                    <DialogDescription>
                    {t('Fill in the details for the talented student.', 'املأ التفاصيل الخاصة بالطالب الموهوب.')}
                    </DialogDescription>
                </DialogHeader>
                <TalentedStudentForm 
                    student={selectedTalentedStudent} 
                    onSubmit={handleTalentedStudentFormSubmit} 
                    onCancel={() => setIsTalentedStudentFormOpen(false)}
                />
                </DialogContent>
            </Dialog>
      </div>
      
       {/* New Activity Registrations & Site Members Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>{t('Activity Registrations', 'التسجيل في الأنشطة')}</CardTitle>
                <CardDescription>{t('View and confirm student registrations for activities.', 'عرض وتأكيد تسجيل الطلاب في الأنشطة.')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('Student', 'الطالب')}</TableHead>
                            <TableHead>{t('Activity', 'النشاط')}</TableHead>
                            <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.map((reg) => {
                            const activity = activities.find(a => a.id === reg.activityId);
                            const activityName = activity ? (language === 'en' ? activity.title : activity.titleAr) : 'Unknown Activity';
                            const isConfirmed = confirmedRegistrations.includes(reg.id);
                            
                            return (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={reg.photoURL || undefined} alt={reg.name} />
                                            <AvatarFallback>{reg.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div>{reg.name}</div>
                                            <div className="text-xs text-muted-foreground">{reg.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{activityName}</TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant={isConfirmed ? "secondary" : "outline"}
                                            size="sm" 
                                            onClick={() => handleConfirmationEmail(reg)}
                                            disabled={isConfirmed}
                                        >
                                            {isConfirmed ? (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    {t('Confirmed', 'تم التأكيد')}
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    {t('Confirm Email', 'تأكيد البريد')}
                                                </>
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t('Site Members', 'أعضاء الموقع')}</CardTitle>
                <CardDescription>{t('Users who have created an account on the platform.', 'المستخدمون الذين أنشأوا حسابًا على المنصة.')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('User', 'المستخدم')}</TableHead>
                            <TableHead>{t('Email', 'البريد الإلكتروني')}</TableHead>
                            <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allUsers.map((user) => {
                            const isWelcomed = welcomedUsers.includes(user.uid);
                            return (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {user.displayName}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell className="text-right">
                                     <Button 
                                        variant={isWelcomed ? "secondary" : "outline"}
                                        size="sm" 
                                        onClick={() => handleWelcomeEmail(user)}
                                        disabled={isWelcomed}
                                    >
                                        {isWelcomed ? (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                {t('Welcomed', 'تم الترحيب')}
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="mr-2 h-4 w-4" />
                                                {t('Welcome Email', 'ترحيب')}
                                            </>
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

        {/* FAQ Management Section */}
        <div>
            <Dialog open={isFaqFormOpen} onOpenChange={setIsFaqFormOpen}>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t('Manage Chatbot FAQs', 'إدارة أسئلة الشات بوت')}</CardTitle>
                        <CardDescription>{t('Add, edit, or remove questions and answers for the chatbot.', 'إضافة أو تعديل أو حذف أسئلة وأجوبة الشات بوت.')}</CardDescription>
                    </div>
                    <Button onClick={handleAddNewFaq}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('Add New FAQ', 'إضافة سؤال جديد')}
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('Question', 'السؤال')}</TableHead>
                        <TableHead className="text-right">{t('Actions', 'الإجراءات')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {faqItems.map((faq) => (
                        <TableRow key={faq.id}>
                            <TableCell className="font-medium">
                            {language === 'en' ? faq.question : faq.questionAr}
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditFaq(faq)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t('Are you sure?', 'هل أنت متأكد؟')}</AlertDialogTitle>
                                        <AlertDialogDescription>{t('This action will permanently delete this FAQ.', 'سيؤدي هذا إلى حذف هذا السؤال نهائيًا.')}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('Cancel', 'إلغاء')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteFaq(faq.id)} className="bg-destructive hover:bg-destructive/90">{t('Delete', 'حذف')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">
                        {selectedFaqItem ? t('Edit FAQ', 'تعديل السؤال') : t('Add New FAQ', 'إضافة سؤال جديد')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('Fill in the details below. Click save when you are done.', 'املأ التفاصيل أدناه. انقر على "حفظ" عند الانتهاء.')}
                    </DialogDescription>
                    </DialogHeader>
                    <FaqForm faqItem={selectedFaqItem} onSubmit={handleFaqFormSubmit} onCancel={() => setIsFaqFormOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
}

    