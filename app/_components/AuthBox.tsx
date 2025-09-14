'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthBox() {
  const supabase = createSupabaseBrowserClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const sendLink = async () => {
    if (!email) return alert('اكتب الإيميل الأول')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) alert(error.message)
    else alert('اتفقّد بريدك—وصل لك لينك الدخول')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:16 }}>
      <input
        placeholder="إيميلك للدخول (Magic Link)"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{ padding:8, minWidth:260 }}
      />
      <button onClick={sendLink} disabled={loading} style={{ padding:8 }}>
        {loading ? 'جارٍ الإرسال...' : 'أرسل لينك الدخول'}
      </button>
      <button onClick={signOut} style={{ padding:8 }}>تسجيل خروج</button>
    </div>
  )
}
