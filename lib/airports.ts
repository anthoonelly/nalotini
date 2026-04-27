// Lista lotnisk i lądowisk w Polsce. Używana w polach autouzupełniania.
export const POLISH_AIRFIELDS: string[] = [
  // Główne lotniska komunikacyjne
  "Warszawa-Okęcie (EPWA)",
  "Warszawa-Modlin (EPMO)",
  "Kraków-Balice (EPKK)",
  "Gdańsk-Rębiechowo (EPGD)",
  "Wrocław-Strachowice (EPWR)",
  "Poznań-Ławica (EPPO)",
  "Katowice-Pyrzowice (EPKT)",
  "Łódź-Lublinek (EPLL)",
  "Rzeszów-Jasionka (EPRZ)",
  "Szczecin-Goleniów (EPSC)",
  "Bydgoszcz (EPBY)",
  "Lublin (EPLB)",
  "Olsztyn-Mazury (EPSY)",
  "Radom-Sadków (EPRA)",
  "Zielona Góra-Babimost (EPZG)",

  // Lotniska sportowe i aerokluby
  "Aeroklub Warszawski - Babice (EPBC)",
  "Aeroklub Krakowski - Pobiednik Wielki (EPKP)",
  "Aeroklub Gliwicki (EPGL)",
  "Aeroklub Wrocławski - Szymanów (EPWS)",
  "Aeroklub Poznański - Kobylnica (EPPK)",
  "Aeroklub Łódzki - Lublinek (EPLL)",
  "Aeroklub Częstochowski - Rudniki (EPRU)",
  "Aeroklub Bielsko-Bialski - Aleksandrowice (EPBA)",
  "Aeroklub Rybnicki - Gotartowice (EPRG)",
  "Aeroklub Lubelski - Radawiec (EPLR)",
  "Aeroklub Białostocki - Krywlany (EPBK)",
  "Aeroklub Mielecki - Mielec (EPML)",
  "Aeroklub Gdański - Pruszcz Gdański (EPPR)",
  "Aeroklub Elbląski - Elbląg (EPEL)",
  "Aeroklub Stalowowolski - Turbia (EPST)",
  "Aeroklub Świdnicki - Świdnik (EPSW)",
  "Aeroklub Podhalański - Nowy Targ (EPNT)",

  // Lądowiska szybowcowe i sportowe
  "Leszno-Strzyżewice (EPLS)",
  "Toruń (EPTO)",
  "Jelenia Góra (EPJG)",
  "Olsztyn-Dajtki (EPOD)",
  "Suwałki (EPSU)",
  "Płock (EPPL)",
  "Krosno (EPKR)",
  "Piotrków Trybunalski (EPPT)",
  "Kalisz (EPKA)",
  "Konin-Kazimierz Biskupi (EPKK)",
  "Inowrocław (EPIR)",
  "Inne lotnisko / lądowisko",
];

export function searchAirfields(query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return POLISH_AIRFIELDS.slice(0, limit);
  return POLISH_AIRFIELDS.filter((a) => a.toLowerCase().includes(q)).slice(
    0,
    limit
  );
}
