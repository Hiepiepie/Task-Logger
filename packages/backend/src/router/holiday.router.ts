import {Router} from "express";
import {getHolidayApi} from "../controller/holiday.controller";

export const holidayRouter = Router({mergeParams: true});

holidayRouter.get('/', getHolidayApi)