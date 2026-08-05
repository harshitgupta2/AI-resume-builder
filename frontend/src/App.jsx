import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/context/AuthProvider.jsx"
import { Toaster } from "react-hot-toast";

function App() {
  return (
  <>
  <Toaster
   position="top-right"
    reverseOrder={false}
   />
  <AuthProvider>
       <RouterProvider router={router}/>
  </AuthProvider>
  </>
  )
}

export default App
