import React, {Context, createContext, useContext, useEffect, useState} from "react";

interface CompetitionProviderValue {
    competition?: string
    setCompetition: React.Dispatch<React.SetStateAction<any>>
    season?: string
    setSeason: React.Dispatch<React.SetStateAction<any>>
}
const CompetitionContext = createContext<CompetitionProviderValue | null>(null)

export const CompetitionProvider: React.FC<{ children: React.ReactNode | null }> = ({ children }) => {
    const [competition, setCompetition] = useState()
    const [season, setSeason] = useState()

    return (
        <CompetitionContext.Provider
            value={{
                competition,
                setCompetition,
                season,
                setSeason
            }}
        >
            { children }
        </CompetitionContext.Provider>
    )
}

export const useCompetition = () => useContext<CompetitionProviderValue>(CompetitionContext as Context<CompetitionProviderValue>);
