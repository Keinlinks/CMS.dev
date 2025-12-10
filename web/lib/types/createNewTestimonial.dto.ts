import { MediaType } from "./mediaType";

export interface createNewTestimonialDto{
    client_email: string;
    client_name: string;
    content: string;
    media_type: MediaType;
    stars_rating: number;
    token:string
}