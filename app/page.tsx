import AuthBox from './_components/AuthBox'
import TodosClient from './_components/TodosClient'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export default async function Page() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main style={{ maxWidth:800, margin:'40px auto', fontFamily:'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom:8 }}>مهامي</h1>
      <p style={{ marginBottom:16 }}>
        {user ? `أهلاً ${user.email}` : 'سجّل دخولك بالإيميل (Magic Link) عشان تضيف وتشوف مهامك.'}
      </p>

      <AuthBox />
      <TodosClient />
    </main>
  )
}
