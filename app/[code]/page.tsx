import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const { code } = params;

  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('code', code)
    .eq('is_deleted', false)
    .maybeSingle();

  if (!link) {
    notFound();
  }

  await supabase
    .from('links')
    .update({
      click_count: link.click_count + 1,
      last_clicked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('code', code);

  redirect(link.target_url);
}
