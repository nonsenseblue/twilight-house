import { createRoot } from 'react-dom/client'
// import { AuthProvider } from './auth/AuthContext'
// import { AppRouter } from './AppRouter'
import { App } from './App'
import '../assets/style/main.css'

createRoot(document.getElementById('root')!).render(<App />)

// 認証を有効にする時はこちらに戻す:
// createRoot(document.getElementById('root')!).render(
//   <AuthProvider>
//     <AppRouter />
//   </AuthProvider>
// )
