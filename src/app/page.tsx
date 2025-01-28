"use client";
// COMPONENTS
import { Banner } from "@/components/banner/Banner";
import { NewsHome } from "@/components/news/NewsHome";
import { Schedule } from "@/components/schedule/Schedule";
import OpenLayersMap from "@/components/map/Map";

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
        </div>
    );
};

export default Home;
