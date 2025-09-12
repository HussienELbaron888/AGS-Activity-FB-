'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type Todo = {
  id: string
  title: string
  done: boolean
  inserted_at: string
  user_id: string
}

export default function TodosClient() {
  const supabase = createSupabaseBrowserClient()
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')

  const loadTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('inserted_at', { ascending: false })
    if (!error) setTodos((data as Todo[]) ?? [])
  }

  useEffect(() => {
    loadTodos()
    const channel = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, () => {
        loadTodos()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const addTodo = async () => {
    const { data: session } = await supabase.auth.getUser()
    if (!session?.user) return alert('سجّل دخول الأول من فوق')
    if (!title.trim()) return
    const { error } = await supabase.from('todos').insert({
      title: title.trim(),
      user_id: session.user.id,
    })
    if (error) return alert(error.message)
    setTitle('')
    loadTodos()
  }

  const toggleDone = async (id: string, done: boolean) => {
    const { error } = await supabase.from('todos').update({ done: !done }).eq('id', id)
    if (!error) loadTodos()
  }

  return (
    <div style={{ maxWidth:600 }}>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <input
          placeholder="اكتب مهمة جديدة"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          style={{ padding:8, flex:1 }}
        />
      <button onClick={addTodo} style={{ padding:8 }}>إضافة</button>
      </div>
      <ul style={{ listStyle:'none', padding:0 }}>
        {todos.map(t => (
          <li key={t.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #eee' }}>
            <span>{t.title}</span>
            <button onClick={()=>toggleDone(t.id, t.done)} style={{ padding:'4px 8px' }}>
              {t.done ? '✅ منجزة' : '⬜️ لم تُنجز'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
