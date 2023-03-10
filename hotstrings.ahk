#SingleInstance Force
; #NoTrayIcon
#InstallKeybdHook

;SetTimer, ChargeWarning, 100
Gui, -Caption
Gui, Color, 000000
return

ChargeWarning:
WinGet, Active, ProcessName, A
if (Active = "StartMenuExperienceHost.exe") {
  Gui, Show, x0 y0 w%A_ScreenWidth% h%A_ScreenHeight%
  MsgBox, 262192, Czytnik Bezprzewodowy, Po zakończonej pracy czytnik bezprzewodowy należy umieścić na stacji ładowania żeby był gotowy następnego dnia.
  Gui, Submit
  SetTimer, ChargeWarning, Off
}
return

:c:DATA::
SendInput, %A_YYYY%-%A_MM%-%A_DD% %A_Hour%:%A_Min% -%A_Space%
return

:c?*:0mm::0 mm
:c?*:1mm::1 mm
:c?*:2mm::2 mm
:c?*:3mm::3 mm
:c?*:4mm::4 mm
:c?*:5mm::5 mm
:c?*:6mm::6 mm
:c?*:7mm::7 mm
:c?*:8mm::8 mm
:c?*:9mm::9 mm

:?: 20w:: dwadzieścia wycinków
:?: 19w:: dziewiętnaście wycinków
:?: 18w:: osiemnaście wycinków
:?: 17w:: siedemnaście wycinków
:?: 16w:: szesnaście wycinków
:?: 15w:: piętnaście wycinków
:?: 14w:: czternaście wycinków
:?: 13w:: trzynaście wycinków
:?: 12w:: dwanaście wycinków
:?: 11w:: jedenaście wycinków
:?: 10w:: dziesięć wycinków
:?: 9w:: dziewięć wycinków
:?: 8w:: osiem wycinków
:?: 7w:: siedem wycinków
:?: 6w:: sześć wycinków
:?: 5w:: pięć wycinków
:?: 4w:: cztery wycinki
:?: 3w:: trzy wycinki
:?: 2w:: dwa wycinki
:?: 1w:: jeden wycinek

::20w::+{Tab 6}20{Tab 6}Dwadzieścia wycinków
::19w::+{Tab 6}19{Tab 6}Dziewiętnaście wycinków
::18w::+{Tab 6}18{Tab 6}Osiemnaście wycinków
::17w::+{Tab 6}17{Tab 6}Siedemnaście wycinków
::16w::+{Tab 6}16{Tab 6}Szesnaście wycinków
::15w::+{Tab 6}15{Tab 6}Piętnaście wycinków
::14w::+{Tab 6}14{Tab 6}Czternaście wycinków
::13w::+{Tab 6}13{Tab 6}Trzynaście wycinków
::12w::+{Tab 6}12{Tab 6}Dwanaście wycinków
::11w::+{Tab 6}11{Tab 6}Jedenaście wycinków
::10w::+{Tab 6}10{Tab 6}Dziesięć wycinków
::9w::+{Tab 6}9{Tab 6}Dziewięć wycinków
::8w::+{Tab 6}8{Tab 6}Osiem wycinków
::7w::+{Tab 6}7{Tab 6}Siedem wycinków
::6w::+{Tab 6}6{Tab 6}Sześć wycinków
::5w::+{Tab 6}5{Tab 6}Pięć wycinków
::4w::+{Tab 6}4{Tab 6}Cztery wycinki
::3w::+{Tab 6}3{Tab 6}Trzy wycinki
::2w::+{Tab 6}2{Tab 6}Dwa wycinki
::1w::Jeden wycinek

::wzksm::wyskrobiny z kanału szyjki macicy
::wzjm::wyskrobiny z jamy macicy
::wpp::wyskrobiny po poronieniu

;######### START OF PRINTED SECTION

::frs::fragment skóry
::oss::osełka skóry
::bzm::brodawkowata zmiana
::owym::o wymiarach


::zpzm::z płaską zmianą
::zwzm::z wyniosłą zmianą
::zlwzm::z lekko wyniosłą zmianą
::zozm::z owrzodziałą zmianą
::zbzm::z brodawkowatą zmianą
::zsowzm::ze słabo odgraniczoną, wyniosłą zmianą
::zsolwzm::ze słabo odgraniczoną, lekko wyniosłą zmianą
::zsoozm::ze słabo odgraniczoną, owrzodziałą zmianą
::zsobzm::ze słabo odgraniczoną, brodawkowatą zmianą

::bzo::barwy żółtej
::bjzo::barwy jasnożółtej
::bbi::barwy białej
::bsk::barwy skóry
::bsz::barwy szarej
::bszzo::barwy szarożółtej
::bszbr::barwy szarobrązowej
::bszbru::barwy szarobrunatnej
::bjsz::barwy jasnoszarej
::bcsz::barwy ciemnoszarej
::bbr::barwy brązowej
::bjbr::barwy jasnobrązowej
::bcbr::barwy ciemnobrązowej
::bbru::barwy brunatnej
::bcz::barwy czerwonej
::bjcz::barwy jasnoczerwonej
::bccz::barwy ciemnoczerwonej
::bro::barwy różowej
::bjro::barwy jasnoróżowej
::bwi::barwy wiśniowej
::bkr::barwy kremowej
::bsr::barwy srebrzystej
::bsrbi::barwy srebrzystobiałej

::ddgc::dochodzącą do granicy cięcia
::mmin::margines minimalny
::mminp::margines minimalny poniżej 1 mm
::mmin1::margines minimalny 1 mm
::mmin2::margines minimalny 2 mm
::mmin3::margines minimalny 3 mm
::mmin4::margines minimalny 4 mm

;#####koniec skóry

::z frs::z fragmentem skóry
::frt::fragment tkankowy
::frte::fragmenty tkankowe
::frgp::fragment gruczołu piersiowego
::dwa frtt::dwa fragmenty tkanki tłuszczowej
::trzy frtt::trzy fragmenty tkanki tłuszczowej
::cztery frtt::cztery fragmenty tkanki tłuszczowej
::2frtt::dwa fragmenty tkanki tłuszczowej
::3frtt::trzy fragmenty tkanki tłuszczowej
::4frtt::cztery fragmenty tkanki tłuszczowej
::frtt::fragment tkanki tłuszczowej
::gtt::guz tkanki tłuszczowej
::frjg::fragment jelita grubego
::frjc::fragment jelita cienkiego
::frj::fragment jelita
::obft::oraz białawe fragmenty tkankowe
::zebt::z elementami białej tkanki
::bot::bez oznaczeń topograficznych

::mięśniak::szary, lity guz o wyglądzie mięśniaka
::mięśniaki::szare, lite guzy o wyglądzie mięśniaków

::nacieka ojtt::nacieka okołojelitową tkankę tłuszczową
::do ojtt::do okołojelitowej tkanki tłuszczowej
::w ojtt::w okołojelitowej tkance tłuszczowej
::ojtt::okołojelitowa tkanka tłuszczowa

::w grcp::w granicy cięcia proksymalnej
::od grcp:: od granicy cięcia proksymalnej
::grcp::granica cięcia proksymalna

::w grcd::w granicy cięcia dystalnej
::od grcd::od granicy cięcia dystalnej
::grcd::granica cięcia dystalna

::litotorbielowate::lito-torbielowate
::wmoh::w miejscu oznaczonym haczykiem
::pmp::pozostałe marginesy powyżej

::nap::na przekroju

::pmt::pofragmentowany materiał tkankowy
::pmkt::pofragmentowany materiał kostno-tkankowy

::pz::pęcherzyk żółciowy
::opz::opróżniony pęcherzyk żółciowy
::copz::częściowo opróżniony pęcherzyk żółciowy

::olwym::o łącznych wymiarach
::owym::o wymiarach
::odl::o długości
::oldl::o łącznej długości
::osr::o średnicy
::ogr::o grubości
::wodl::w odległości
::nagl::na głębokość
::bpz::bez podejrzanych zmian
::bpo::bez podejrzanych ognisk
::zoss::z osełką skóry

::zwch::z węzłami chłonnymi
::z1wch::z węzłem chłonnym
::z2wch::z dwoma węzłami chłonnymi
::z3wch::z trzema węzłami chłonnymi
::z4wch::z czterema węzłami chłonnymi
::z5wch::z pięcioma węzłami chłonnymi
::z6wch::z sześcioma węzłami chłonnymi
::z7wch::z siedmioma węzłami chłonnymi
::z8wch::z ośmioma węzłami chłonnymi
::z9wch::z dziewięcioma węzłami chłonnymi

::w kwg::w kwadrancie wewnętrznym górnym
::w kwd::w kwadrancie wewnętrznym dolnym
::w kzd::w kwadrancie zewnętrznym dolnym
::w kzg::w kwadrancie zewnętrznym górnym
::w kgw::w kwadrancie górnym wewnętrznym
::w kdw::w kwadrancie dolnym wewnętrznym
::w kdz::w kwadrancie dolnym zewnętrznym
::w kgz::w kwadrancie górnym zewnętrznym
::kwg::kwadrant wewnętrzny górny
::kwd::kwadrant wewnętrzny dolny
::kzd::kwadrant zewnętrzny dolny
::kzg::kwadrant zewnętrzny górny
::kgw::kwadrant górny wewnętrzny
::kdw::kwadrant dolny wewnętrzny
::kdz::kwadrant dolny zewnętrzny
::kgz::kwadrant górny zewnętrzny
::ngkw::na granicy kwadrantów wewnętrznych
::ngkz::na granicy kwadrantów zewnętrznych
::ngkg::na granicy kwadrantów górnych
::ngkd::na granicy kwadrantów dolnych

::do mmin::do marginesu minimalnego
::do mbo::do marginesu bocznego
::do mprzy::do marginesu przyśrodkowego
::do mprze::do marginesu przedniego
::do mgl::do marginesu głębokiego
::do mgł::do marginesu głębokiego
::do mgo::do marginesu górnego
::do mgó::do marginesu górnego
::do mdo::do marginesu dolnego
::do mch::do marginesu chirurgicznego
::w mmin::w marginesie minimalnym
::w mbo::w marginesie bocznym
::w mprzy::w marginesie przyśrodkowym
::w mprze::w marginesie przednim
::w mgl::w marginesie głębokim
::w mgł::w marginesie głębokim
::w mgo::w marginesie górnym
::w mgó::w marginesie górnym
::w mdo::w marginesie dolnym
::w mch::w marginesie chirurgicznym
::w okolicy mmin::w okolicy marginesu minimalnego
::w okolicy mbo::w okolicy marginesu bocznego
::w okolicy mprzy::w okolicy marginesu przyśrodkowego
::w okolicy mprze::w okolicy marginesu przedniego
::w okolicy mgl::w okolicy marginesu głębokiego
::w okolicy mgł::w okolicy marginesu głębokiego
::w okolicy mgo::w okolicy marginesu górnego
::w okolicy mgó::w okolicy marginesu górnego
::w okolicy mdo::w okolicy marginesu dolnego
::w okolicy mch::w okolicy marginesu chirurgicznego
::mbo::margines boczny
::mprzy::margines przyśrodkowy
::mprze::margines przedni
::mgl::margines głęboki
::mgł::margines głęboki
::mty::margines tylni
::mgo::margines górny
::mgó::margines górny
::mdo::margines dolny
::mch::margines chirurgiczny