# PatARCH - nakładka Brzozów
Niniejsze repozytorium zawiera userscript stanowiący rozszerzenie systemu PatARCH na potrzeby Zakładu Patomorfologii szpitala onkologicznego w Brzozowie.

Początkowo skrypt miał za zadanie naprawić błąd w programie, który pomoc techniczna MedLANu uznała za niemożliwy do rozwiązania (zgłoszenie [MedLAN#5209886]).
Zdenerwowali mnie tym trochę bo jest to coś co zgłaszałem już w tygodniu wprowadzającym program na zakład i nie jest to sprawa wcale skomplikowana.
Doszedłem więc do wniosku że zrobię to sam.    

# Funkcje
Z czasem funkcjonalność została rozszerzona o dodatkowe opcje usprawniające prace na zakładzie.

Dodatkowe skróty klawiszowe
--------
`Ctrl+D` **Wymaga dotrwalenia** - podczas edycji oznacza bloczek jako wymagający dotrwalenia     
`Ctrl+R` **Wycinek rozfragmentowany** - podczas edycji oznacza wycinek jako rozfragmentowany     

Skróty zakładowe
-------
System szablonów dostępny w programie nadaje się doskonale do długich opisów
makroskopowych. Dla drobnych opisów o dużej zmienności konieczność wpisywania
`#` przed każdym skrótem spowalnia pisanie i ogranicza możliwości systemu.     
Nakładka wprowadza więc system skrótów wewnątrzzakładowych oparty na prostych
operacjach zamiany. Umożliwia to używanie krótkich i szybkich kombinacji jak
skrót `bjbr` rozwijany do zwrotu "barwy jasnobrązowej" oraz korektę
powtarzających się błędów jak brak odstępu przed jednostką e.g. "1mm" zamiast
"1 mm" lub rozdzielenie wymiarów złym znakiem e.g. "2c3c4" zamiast "2x3x4".     
Dodatkowo możliwa jest ingerencja w wartości poza polem tekstowym opisu taka jak
korekta ilości wycinków, oznaczenie materiału jako rozfragmentowany lub
wymagający dodatkowego utrwalenia na podstawie informacji zawartych w opisie
makroskopowym.

Hasło w kodzie kreskowym
--------
Program PatARCH wymaga od użytkowników zmian hasła co 30 dni. W praktyce
prowadzi to do sytułacji w której hasła do kont używane na zakładzie są bardzo
proste do odgadnięcia, a dostanie się do systemu wymaga znajomości jedynie
nazwisk kilku pracowników i kalendarza. Sytuację pogarsza fakt że logowanie do
systemu jest bardzo częste. Wykonanie nawet prostej czynności wymaga pełnego
logowania na nowym komputerze. Długie hasła, których wpisywanie (i zapamiętanie)
zajmuje trochę czasu nie są więc praktyczne.       
Rozwiązaniem takiego problemu jest zawarcie haseł do logowanie na kodach
kreskowych. Wszystkie komputery zakładowe wyposażone są w czytniki kodów
kreskowych. Nakładka pozwala pracownikowi zalogowanie się do systemu poprzez
zeskanowanie kodu kreskowego z zakodowanym loginem i hasłem. W takiej sytuacji
hasła mogą być dłuższe, a logowanie jest szybsze.


