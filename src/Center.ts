export interface Center {
    name: string;
    address: string,
    pin: number,
    fee_type: string;
    vaccines: Vaccines[]
}

export interface Vaccines {
    available_capacity: number;
    min_age_limit: number;
    vaccine: string;
    date: string;
}
