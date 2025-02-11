export interface memberParams {
    name: string;
    descriptionENG: string;
    descriptionPL: string;
    file: any;
    id: number;
}

export interface contactParams {
    id: string;
    name: string;
    descriptionENG: string;
    descriptionPL: string;
    file: any;
    phone: string;
    email: string;
}

export interface requestSectionParams {
    name: string;
    descriptionEng?: any;
    descriptionPl?: any;
    members: memberParams[] | string[];
}
export interface sectionParams extends requestSectionParams {
    id: string;
}

export const defaultSection = {
    id: "",
    name: "",
    members: [],
};

export const defaultMember = {
    name: "",
    descriptionENG: "",
    descriptionPL: "",
    file: "",
    id: -1,
};

export const defaultContact = {
    id: "",
    name: "",
    descriptionENG: "",
    descriptionPL: "",
    file: "",
    phone: "",
    email: "",
};
