import { apiHelper } from "./apiHelper";

export const getSlidesList = async(params) => {
    return apiHelper('get', 'slides', { params })
};