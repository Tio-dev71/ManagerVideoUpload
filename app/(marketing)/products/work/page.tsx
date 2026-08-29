import WorkHero from '@/components/marketing/work/work-hero';
import WorkFeatures from '@/components/marketing/work/work-features';
import WorkWorkflow from '@/components/marketing/work/work-workflow';
import WorkBenefits from '@/components/marketing/work/work-benefits';
import WorkCta from '@/components/marketing/work/work-cta';
import WorkPartners from '@/components/marketing/work/work-partners';

export const metadata = {
  title: 'Topify Work - Quản trị công việc & đội nhóm',
  description: 'Hiệu suất vượt trội – Kết quả đột phá',
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-white">
      <WorkHero />
      <WorkFeatures />
      <WorkWorkflow />
      <WorkBenefits />
      <WorkCta />
      <WorkPartners />
    </main>
  );
}
