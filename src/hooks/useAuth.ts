import { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { useSupabaseClient } from "./useSupabaseClient";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const supabase = useSupabaseClient();
  const [state, setState] = useState<Omit<AuthState, "signOut">>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user ?? null,
          session: session ?? null,
          isLoading: false,
        });
      }
    );
    // 최초 상태 fetch
    supabase.auth.getSession().then(({ data }) => {
      setState({
        user: data.session?.user ?? null,
        session: data.session ?? null,
        isLoading: false,
      });
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return { ...state, signOut };
}
