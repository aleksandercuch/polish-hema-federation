import { memberParams } from "./management.interface";

export interface requestCooperationParams {
    name: string;
    descriptionAng: any;
    descriptionPl: any;
    members: memberParams[];
}
export interface cooperationParams extends requestCooperationParams {
    id: string;
}
export const defaultCooperation = {
    descriptionAng: "",
    descriptionPl: "",
    members: [],
};
