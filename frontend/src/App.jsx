import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import Profile from "./pages/Profile";
import CourseForm from "./pages/CourseForm";
import Testimonial from "./pages/Testimonial";
import Fonctionnement from './pages/Fonctionnement';
import Temoignages from "./pages/Temoignages";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/cours" element={<Courses />} />
        <Route path="/fonctionnement" element={<Fonctionnement />} />
        <Route path="/temoignages" element={<Temoignages />} />
        <Route path="/cours/:slug" element={<CourseDetail />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profil" element={<Profile />} />
        <Route path="temoignage" element={<Testimonial />} />
        <Route path="cours/nouveau" element={<CourseForm />} />
        <Route path="cours/:slug/modifier" element={<CourseForm />} />
      </Route>
    </Routes>
  );
}

export default App;
