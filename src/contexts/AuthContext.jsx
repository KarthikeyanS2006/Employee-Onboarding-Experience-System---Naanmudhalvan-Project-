import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, signIn, signUp, signOut, getCurrentUser } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const profileData = await getCurrentUser()
          if (profileData) {
            setUser(profileData)
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profileData = await getCurrentUser()
        setUser(profileData)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    await signIn(email, password)
    const profileData = await getCurrentUser()
    setUser(profileData)
    setProfile(profileData)
    return profileData
  }

  const register = async (email, password, name, role, department) => {
    await signUp(email, password, name, role, department)
    const profileData = await getCurrentUser()
    setUser(profileData)
    setProfile(profileData)
    return profileData
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      isEmployee: profile?.role === 'employee',
      isMentor: profile?.role === 'mentor',
      isHR: profile?.role === 'hr'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
