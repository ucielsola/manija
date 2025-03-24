import type { ColorType } from "./common";

export interface Toast {
    id: string;
    text: string;
    type: ColorType;
}