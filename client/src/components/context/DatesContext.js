import { useContext, useReducer, createContext } from "react";

const DatesContext = createContext(null);
const DatesDispatchContext = createContext(null);

const initialDates = { dates: null };

function useDates() {
    return useContext(DatesContext);
};

function useDatesDispatch() {
    return useContext(DatesDispatchContext);
};

function datesReducer(dates, action) {
    switch (action.type) {
        case "mount": {
            return {
                ...dates,
                dates: action.dates
            }
        };
        
        case "unmount": {
            return {
                ...dates,
                dates: null
            }
        };

        case "add": {
            return {
                ...dates,
                dates: [action.date, ...dates.dates]
            }
        };

        case "delete": {
            return {
                ...dates,
                dates: dates.dates.filter((date) => date.id !== action.date.id)
            }
        };

        case "update": {
            const filteredDates = dates.dates.filter((date) => date.id !== action.date.id);
            
            return {
                ...dates,
                dates: [action.date, ...filteredDates]
            }
        };
    };
};

function DatesProvider({ children }) {
    const [dates, dispatch] = useReducer(
        datesReducer,
        initialDates
    )

    return (
        <DatesContext.Provider value={dates}>
            <DatesDispatchContext.Provider value={dispatch}>
                {children}
            </DatesDispatchContext.Provider>
        </DatesContext.Provider>
    );
};

export { DatesContext, DatesProvider, useDatesDispatch, useDates };