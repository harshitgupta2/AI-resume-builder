import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/context/AuthProvider.jsx"
import { Toaster } from "react-hot-toast";
import {InterviewContextProvider} from '../src/features/interview/context/interviewContextProvider.jsx'

function App() {
  return (
  <>
  <Toaster
   position="top-right"
    reverseOrder={false}
   />
  <AuthProvider>
    <InterviewContextProvider>
       <RouterProvider router={router}/>
    </InterviewContextProvider>
  </AuthProvider>
  </>
  )
}

export default App
