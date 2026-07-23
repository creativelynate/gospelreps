import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return }

    supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data)
        setLoading(false)
      })
  }, [user])

  async function updateDisplayName(display_name) {
    if (!user) return { error: 'Not signed in' }

    const { error } = await supabase
      .from('users')
      .update({ display_name })
      .eq('id', user.id)

    if (!error) setProfile(prev => ({ ...prev, display_name }))
    return { error }
  }

  return { profile, loading, updateDisplayName }
}