import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MainPage from './pages/MainPage';
import CollegePage from './pages/CollegePage';
import SeniorsPage from './pages/SeniorsPage';
import PYQPage from './pages/PYQPage';
import StorePage from './pages/StorePage';
import CommunityPage from './pages/CommunityPage';
import WhatsAppGroupPage from './pages/WhatsAppGroupPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import NotesPage from './pages/NotesPage';
import AddSenior from './Forms/AddSenior';
import AddCollege from './Forms/AddCollege';
import AboutPage from './pages/AboutPage';
import Signup from './pages/Signup';
import SignIn from './pages/Signin';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import InstallPage from './pages/InstallPage';
import NotFoundPage from './components/NotFoundPage';
import ContactUs from './Forms/ContactUs';
import PrivacyPolicy from './others/PrivacyPolicy';
import PostDetail from './DetailPages/PostDetail';
import FAQPage from './others/FAQPage';
import BundlePyq from './DetailPages/BundlePyq';
import ProductDetail from './DetailPages/ProductDetail';
import PyqDetail from './DetailPages/PyqDetail';
import SeniorDetailPage from './DetailPages/SeniorDetailPage';

const validColleges = [
    'integral-university',
    'mpec-kanpur',
    'gcet-noida',
    'kmc-university',
];

const ValidateCollegeRoute = ({ children }) => {
    const { collegeName } = useParams();

    if (!validColleges.includes(collegeName)) {
        return <Navigate to="/not-found" replace />;
    }

    return children;
};

const RoutesComponent = () => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />

            {/* College Routes */}
            <Route
                path="/college/:collegeName"
                element={
                    <ValidateCollegeRoute>
                        <CollegePage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/seniors"
                element={
                    <ValidateCollegeRoute>
                        <SeniorsPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/seniors/:id"
                element={
                    <ValidateCollegeRoute>
                        <SeniorDetailPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/pyq"
                element={
                    <ValidateCollegeRoute>
                        <PYQPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/pyq/bundle"
                element={
                    <ValidateCollegeRoute>
                        <BundlePyq />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/pyq/:id"
                element={
                    <ValidateCollegeRoute>
                        <PyqDetail />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/store"
                element={
                    <ValidateCollegeRoute>
                        <StorePage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/store/:id"
                element={
                    <ValidateCollegeRoute>
                        <ProductDetail />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/community"
                element={
                    <ValidateCollegeRoute>
                        <CommunityPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/community/post/:id"
                element={
                    <ValidateCollegeRoute>
                        <PostDetail />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/whatsapp-group"
                element={
                    <ValidateCollegeRoute>
                        <WhatsAppGroupPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/opportunities"
                element={
                    <ValidateCollegeRoute>
                        <OpportunitiesPage />
                    </ValidateCollegeRoute>
                }
            />
            <Route
                path="/college/:collegeName/notes"
                element={
                    <ValidateCollegeRoute>
                        <NotesPage />
                    </ValidateCollegeRoute>
                }
            />

            {/* Static Routes */}
            <Route path="/becomesenior" element={<AddSenior />} />
            <Route path="/add-college" element={<AddCollege />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Authentication Routes */}
            <Route
                path="/sign-in"
                element={isAuthenticated ? <Navigate to="/" /> : <SignIn />}
            />
            <Route path="/sign-up" element={<Signup />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Other Pages */}
            <Route path="/install" element={<InstallPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Catch-all for undefined routes */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default RoutesComponent;