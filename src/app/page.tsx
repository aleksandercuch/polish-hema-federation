"use client";

// COMPONENTS
import { Banner } from "@/components/banner/Banner";
import { NewsHome } from "@/components/posts/NewsHome";
import { Schedule } from "@/components/schedule/Schedule";
import OpenLayersMap from "@/components/map/Map";
import Footer from "@/components/footer/Footer";

const Home = () => {
    return (
        <div>
            <Banner />
            <section id="NewsHome">
                <NewsHome />
            </section>
            <section id="Schedule">
                <Schedule />
            </section>
            <section id="OpenLayersMap">
                <OpenLayersMap />
            </section>
            <Footer />
        </div>
    );
};

export default Home;
