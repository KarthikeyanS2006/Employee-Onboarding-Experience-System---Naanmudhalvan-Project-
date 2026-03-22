import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nmrzthhiafbmeievbwtq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcnp0aGhpYWZibWVpZXZid3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDQ5MDcsImV4cCI6MjA4OTcyMDkwN30.e9eyLx4Nn6iZejrtsfCc10S1yR0xz3NPkOg5xtfeuXk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email, password, name, role = 'employee', department = '') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        department
      }
    }
  })
  
  if (error) throw error
  
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: data.user.id,
        name,
        email,
        role,
        department,
        joining_date: new Date().toISOString().split('T')[0]
      })
    
    if (profileError) console.error('Profile creation error:', profileError)
  }
  
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (profile) return profile
  } catch (err) {
    console.warn('Profile not found, using default:', err.message)
  }
  
  return { 
    id: user.id,
    user_id: user.id,
    name: user.email?.split('@')[0] || 'User', 
    email: user.email,
    role: 'employee',
    department: ''
  }
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}
