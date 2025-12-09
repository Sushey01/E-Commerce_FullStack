/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_ENABLE_KHALTI?: string
  readonly VITE_KHALTI_BASE_URL?: string
  readonly VITE_KHALTI_PUBLIC_KEY?: string
  readonly VITE_KHALTI_SECRET_KEY?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
