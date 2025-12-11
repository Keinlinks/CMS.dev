import { MediaType } from "./mediaType";

export interface createNewTestimonialDto{
    client_email: string;
    client_name: string;
    content: string;
    stars_rating: number;
    token:string
    file?:File
}