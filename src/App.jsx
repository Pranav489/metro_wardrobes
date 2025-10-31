import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import FactoryOutletPage from "./pages/FactoryOutlet/FactoryOutlet";
import FranchiseOpportunity from "./pages/Franchise/FranchiseOpportunity";
import PageNotFound from "./pages/ErrorPages/NotFound";
import ProductsPage from "./pages/Products/ProductsPage";
import ContactUsPage from "./pages/ContactUs/ContactUsPage";
import ProjectsPage from "./pages/Projects/ProjectsPage";
import BlogPage from "./pages/Blog/BlogPage";
import BlogDetailsPage from "./pages/Blog/BlogDetailsPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/factory-outlet" element={<FactoryOutletPage />} />
        <Route path="/ishani-partnership" element={<FranchiseOpportunity />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailsPage />} />
        <Route path="/gallery" element={<ProjectsPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
