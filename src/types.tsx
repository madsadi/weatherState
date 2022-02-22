export type Post = {
    id:number,
    name:string,
    wind:{
        speed:number,
        deg:number
    },
    main:{
        feels_like: number,
        humidity: number,
        pressure: number,
        temp: number,
        temp_max: number,
        temp_min: number,
    },
    coord: {
        lat: number,
        lon: number,
    }
}