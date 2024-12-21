"use client";
import { createContext, useContext } from "react";
import { Tournament } from "@/lib/types";

type TournamentContextType = {
  tournament: Tournament;
};

export const TournamentContext = createContext<TournamentContextType>({
  tournament: {} as Tournament,
});


export function TournamentProvider({ tournament, children }: Readonly<{ tournament: Tournament; children: React.ReactNode }>) {
  return (
    <TournamentContext.Provider value={{ tournament }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  return useContext(TournamentContext);
}
