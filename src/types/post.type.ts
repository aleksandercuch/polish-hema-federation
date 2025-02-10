export type PostT = {
    id: string;
    titleENG: string;
    titlePL: string;
    introENG: string;
    introPL: string;
    descriptionENG: any;
    descriptionPL: any;
    mainFile: any;
    date: Date;
    images: File[] | string[];
};
