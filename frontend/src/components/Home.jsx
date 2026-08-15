import React from "react";
import LatestProduct from "./common/LatestProduct";
import FeaturedProduct from "./common/FeaturedProduct";
import Hero from "./common/Hero";
import Layout from "./common/Layout";
import CustomCursor from "./common/CustomCursor";

const Home = () => {
  return (
    <>

    <CustomCursor />
      {/* Navbar */}

      <Layout>
        <Hero />
        
        <LatestProduct />

        <FeaturedProduct />
      </Layout>
    </>
  );
};

export default Home;
