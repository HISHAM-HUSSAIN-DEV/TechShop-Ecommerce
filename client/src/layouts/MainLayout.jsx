import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const MainLayout = () => {

    return (
        <>
            <Header />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default MainLayout