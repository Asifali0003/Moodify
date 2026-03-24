import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import '/src/features/shared/style/global.scss'
import {AuthProvider} from "./features/auth/auth.context"
import { SongProvider } from "./features/home/song.context"

function App() {

return (
  <AuthProvider>
    <SongProvider>
    <RouterProvider router={router}/>
    </SongProvider>
  </AuthProvider>
)
}

export default App
