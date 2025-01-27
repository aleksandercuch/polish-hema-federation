import React, { useEffect } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon } from "ol/style";
import Overlay from "ol/Overlay";
import styles from "./map.module.css"; // Import styles

const OpenLayersMap = () => {
    useEffect(() => {
        const map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([19.4795, 52.0665]),
                zoom: 7,
            }),
        });

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({ source: vectorSource });

        const markers = [
            {
                coord: [18.6466, 54.3521],
                label: "Gdańsk Center\nPopulation: 470,000",
            },
            { coord: [21.0122, 52.2297], label: "Warsaw" },
            { coord: [19.455, 51.7592], label: "Łódź" },
        ];

        markers.forEach((marker) => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(marker.coord)),
                name: marker.label,
            });

            feature.setStyle(
                new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: "https://cdn.pixabay.com/photo/2018/05/01/15/06/marker-3365838_1280.png",
                        scale: 0.05,
                    }),
                })
            );

            vectorSource.addFeature(feature);
        });

        map.addLayer(vectorLayer);

        const overlay = new Overlay({
            element: document.createElement("div"),
            positioning: "bottom-center",
            stopEvent: false,
        });
        overlay.getElement().className = styles.tooltip; // Use dynamic class
        map.addOverlay(overlay);

        map.on("pointermove", (event) => {
            const feature = map.forEachFeatureAtPixel(
                event.pixel,
                (feature) => feature
            );
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                overlay.getElement().textContent = feature.get("name");
                overlay.setPosition(coordinates);
            } else {
                overlay.setPosition(undefined);
            }
        });

        return () => {
            map.setTarget(null);
        };
    }, []);

    return <div id="map" style={{ width: "100%", height: "80vh" }} />;
};

export default OpenLayersMap;
