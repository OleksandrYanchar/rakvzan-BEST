import ContactPage from "../features/contact/ContactPage";
import MainPage from "../features/mainPage/MainPage";
import MapPage from "../features/map/MapPage";
import { RouterType } from "../types/routersTypes";

export const routes: RouterType[] = [
    {
        path: '/',
        element: <MainPage/>
    },
    {
        path: '/map',
        element: <MapPage/>
    },
    {
        path: '/contact',
        element: <ContactPage/>
    },
]