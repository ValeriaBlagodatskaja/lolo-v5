import App from '@/App.tsx'
import FeedListProvider from '@/contexts/FeedListContext.tsx'
import '@/index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FeedListProvider>
      <App />
    </FeedListProvider>
  </React.StrictMode>
)
