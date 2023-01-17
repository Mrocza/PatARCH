// ==UserScript==
// @name         Nakładka Brzozów
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Nakładka na program PatARCH opracowana na potrzeby Zakładu Patomorfologii Brzozów.
// @author       Piotr Milczanowski
// @homepage     https://github.com/Mrocza/PatARCH
// @match        https://brzozow.patarch.medlan.pl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==



setTimeout(function () {
    'use strict';
    console.log('Nakładka Brzozów w wersji 0.3');

    // Weryfikacja całości materiału. Patrz zgłoszenie [MedLAN#5209886].
    if (window.location.href.match(/analysis_(new|edit)/)) {
        let used = document.querySelector('#m_used_entirely');
        if (!selectedEmpty() && selectedHasAnalysis() && used.checked) {
            used.checked = false;
            displayText('Skorygowano pozycję "Mat. zużyty w całości?"', 'Wewnątrzzakładowa korekta błędu. Patrz zgłoszenie [MedLAN#5209886].', 260);
        }
    }
    // Zaznaczenie całości textu w polu lokalizacji
    if (window.location.href.match(/localization_new/)) {
        let localization = document.querySelector('#l_description');
        localization.select();
    }
    // Dodatkowe skróty klawiszowe
    if (window.location.href.match(/analysis_(new|edit)/)) {
        let moreFixation = document.querySelector('#a_more_fixation');
        addKeyboardShortcut(moreFixation, 'd', { ctrl: true })
        let sampleFragmented = document.querySelector('#a_sample_fragmented');
        addKeyboardShortcut(sampleFragmented, 'r', { ctrl: true })

        addKeyboardShortcut(null, 'w', { ctrl: true })
    }
    // Skróty wewnątrzzakładowe
    if (window.location.href.match(/analysis_(new|edit)/)) {
        let macro = document.querySelector('#m_macro_img');
        enableAbbriviations(macro)
    }
    // Strony startowe dla stanowisk pracy
    if (window.location.href.match(/menu\/start(\/|\?place_was_changed=)1$/)) {
        if (getLocation() == 'Pracownia Histopatologii - Zatapianie')
            document.location = '/workplace/embedding';
        if (getLocation() == 'Pracownia Histopatologii - Krojenie')
            document.location = '/workplace/slicing2';
    }
    // Hasło w kodzie
    if (window.location.href.match(/medlan\.pl(\/user\/login|)\/?$/)) {
        let login = document.querySelector('#user_login');
        let pass = document.querySelector('#user_password');
        document.addEventListener('keydown', function (e) {
            if (e.key == 'F3') {
                e.preventDefault();
                pass.focus();
            }
            if (e.key == 'Enter') {
                e.preventDefault();
                if (login.value == '') {
                    let creds = pass.value; // format kodu: login<br/>hasło
                    if (creds.includes('<br/>')) {
                        creds = creds.split('<br/>')
                    } else {
                        creds = atob(creds).split('<br/>')
                    }
                    login.value = creds[0];
                    pass.value = creds[1];
                }
                document.querySelector('input.button').click();
            }
        });
    }
    if (window.location.href.match(/user\/logout/)) {
        document.addEventListener('keydown', function (e) {
            if (e.key == 'F3') {
                e.preventDefault();
                document.location = '/user/login';
            }
        });
        setTimeout(function () {
            document.location = '/user/login';
        }, 10000);
    }
    // document.querySelectorAll('#dl-form dt')[16]
}, 300);

function displayText(text, hoverText = 'Dodatek PatARCH Brzozów.', width = 200) {
    /*
      Wyświetla informacje w prawym dolnym rogu paska statusu.
    */
    let footer = document.querySelector('#div-main-footer');
    let addonBox = document.querySelector('#addon-box');
    if (!addonBox) {
        addonBox = document.createElement('span');
        addonBox.style.opacity = 0.7;
        addonBox.style.float = 'right';
        addonBox.style.cursor = 'default';
        addonBox.setAttribute('onmouseover', `return overlib('${hoverText}', WIDTH, ${width}, ABOVE, LEFT);`);
        addonBox.setAttribute('onmouseout', 'return nd();')
        footer.appendChild(addonBox);
    }
    addonBox.innerHTML = `${text} |&nbsp`
}

function getUser() {
    /*
      Zwraca login aktualnie zalogowanej osoby.
    */
    let user = document.querySelector('a.footer_stats_link').innerHTML.match(/\s*(?<fullname>[^(]*) \((?<login>[^)]*)\)/);
    return user.groups.login
}

function getLocation() {
    /*
      Zwraca miejsce pracy.
    */
    return document.querySelector('.banner_licence').text
}

function selectedEmpty() {
    /*
      Zwraca true jeżeli aktwny materiał został pobrany w całości.
    */
    let materials = document.querySelector('#sortablelist_m').children;
    for (let material of materials) {
        if (material.querySelector('.scrollSelected')) {
            return material.querySelectorAll('img')[1].src.includes('empty') // img z indeksem 0 to łącznik, pod 1 jest ikonka pojemnika
        }
    }
    return false
}

function selectedHasAnalysis() {
    /*
      Zwraca true jeżeli aktywny materiał ma dodane badania.
    */
    let materials = document.querySelector('#sortablelist_m').children;
    for (let material of materials) {
        if (material.querySelector('.scrollSelected')) {
            return material.querySelector('a[context=analysis]') !== null;
        }
    }
    return false
}

function addKeyboardShortcut(element, key = '', { ctrl = false, shift = false, alt = false }) {
    /*
      Dodaje skrót klawiszowy do wskazanego elementu.
    */
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey == ctrl && e.shiftKey == shift && e.altKey == alt && e.key == key) {
            e.preventDefault();
            if (element && element.type == 'checkbox') {
                element.checked = !element.checked;
            }
        }
    });
    if (element) {
        let hint = document.createElement('span');
        hint.classList.add('form-descr');
        hint.innerHTML += `&nbsp[${ctrl ? 'Ctrl+' : ''}${key.toUpperCase()}]&nbsp`;
        element.after(hint)
    }
}

function enableAbbriviations(element) {
    /*
      Uruchamia skróty wewnątrzzakładowe dla wskazanego elementu.
    */
    var abbrs = [
        // zamiany funkcyjne:
        [/^([0-9]+)w[ .,:;]/i, (...a)=>{document.querySelector('#a_sample_count').value=a[1];return a[0]}],
        [/^(wzksm|wzjm)[ .,:;]/i, (...a)=>{document.querySelector('#a_sample_fragmented').checked=1;return a[0]}],
        [/wyskrob.*(bcz|bjcz|bccz)[ .,:;]/i, (...a)=>{document.querySelector('#a_more_fixation').checked=1;return a[0]}],
        // zamiany specjalne:
        [/([0-9\]])mm/, '$1 mm'],
        [/([0-9]+)[zxcs]([0-9]+)[zxcs]([0-9]+)([zxcs]|)/, '$1x$2x$3'],
        // materiały drobne
        [/\b1w([ .,:;])/i, 'jeden wycinek$1'],
        [/\b2w([ .,:;])/i, 'dwa wycinki$1'],
        [/\b3w([ .,:;])/i, 'trzy wycinki$1'],
        [/\b4w([ .,:;])/i, 'cztery wycinki$1'],
        [/\b5w([ .,:;])/i, 'pięć wycinków$1'],
        [/\b6w([ .,:;])/i, 'sześć wycinków$1'],
        [/\b7w([ .,:;])/i, 'siedem wycinków$1'],
        [/\b8w([ .,:;])/i, 'osiem wycinków$1'],
        [/\b9w([ .,:;])/i, 'dziewięć wycinków$1'],
        [/\b10w([ .,:;])/i, 'dziesięć wycinków$1'],
        [/\b11w([ .,:;])/i, 'jedenaście wycinków$1'],
        [/\b12w([ .,:;])/i, 'dwanaście wycinków$1'],
        [/\b13w([ .,:;])/i, 'trzynaście wycinków$1'],
        [/\b14w([ .,:;])/i, 'czternaście wycinków$1'],
        [/\b15w([ .,:;])/i, 'piętnaście wycinków$1'],
        [/\b16w([ .,:;])/i, 'szesnaście wycinków$1'],
        [/\b17w([ .,:;])/i, 'siedemnaście wycinków$1'],
        [/\b18w([ .,:;])/i, 'osiemnaście wycinków$1'],
        [/\b19w([ .,:;])/i, 'dziewiętnaście wycinków$1'],
        [/\b20w([ .,:;])/i, 'dwadzieścia wycinków$1'],
        [/\bwzksm([ .,:;])/i, 'wyskrobiny z kanału szyjki macicy$1'],
        [/\bwzjm([ .,:;])/i, 'wyskrobiny z jamy macicy$1'],
        [/\bwpp([ .,:;])/i, 'wyskrobiny po poronieniu$1'],
        // barwy
        [/\bbzo([ .,:;])/i, 'barwy żółtej$1'],
        [/\bbjzo([ .,:;])/i, 'barwy jasnożółtej$1'],
        [/\bbbi([ .,:;])/i, 'barwy białej$1'],
        [/\bbsk([ .,:;])/i, 'barwy skóry$1'],
        [/\bbsz([ .,:;])/i, 'barwy szarej$1'],
        [/\bbszzo([ .,:;])/i, 'barwy szarożółtej$1'],
        [/\bbszbr([ .,:;])/i, 'barwy szarobrązowej$1'],
        [/\bbszbru([ .,:;])/i, 'barwy szarobrunatnej$1'],
        [/\bbjsz([ .,:;])/i, 'barwy jasnoszarej$1'],
        [/\bbcsz([ .,:;])/i, 'barwy ciemnoszarej$1'],
        [/\bbbr([ .,:;])/i, 'barwy brązowej$1'],
        [/\bbjbr([ .,:;])/i, 'barwy jasnobrązowej$1'],
        [/\bbcbr([ .,:;])/i, 'barwy ciemnobrązowej$1'],
        [/\bbbru([ .,:;])/i, 'barwy brunatnej$1'],
        [/\bbcz([ .,:;])/i, 'barwy czerwonej$1'],
        [/\bbjcz([ .,:;])/i, 'barwy jasnoczerwonej$1'],
        [/\bbccz([ .,:;])/i, 'barwy ciemnoczerwonej$1'],
        [/\bbro([ .,:;])/i, 'barwy różowej$1'],
        [/\bbjro([ .,:;])/i, 'barwy jasnoróżowej$1'],
        [/\bbwi([ .,:;])/i, 'barwy wiśniowej$1'],
        [/\bbkr([ .,:;])/i, 'barwy kremowej$1'],
        [/\bbsr([ .,:;])/i, 'barwy srebrzystej$1'],
        [/\bbsrbi([ .,:;])/i, 'barwy srebrzystobiałej$1'],
        // skóry
        [/\bfrs([ .,:;])/i, 'fragment skóry$1'],
        [/\boss([ .,:;])/i, 'osełka skóry$1'],
        [/\bbzm([ .,:;])/i, 'brodawkowata zmiana$1'],
        [/\bzpzm([ .,:;])/i, 'z płaską zmianą$1'],
        [/\bzwzm([ .,:;])/i, 'z wyniosłą zmianą$1'],
        [/\bzlwzm([ .,:;])/i, 'z lekko wyniosłą zmianą$1'],
        [/\bzozm([ .,:;])/i, 'z owrzodziałą zmianą$1'],
        [/\bzbzm([ .,:;])/i, 'z brodawkowatą zmianą$1'],
        [/\bzsowzm([ .,:;])/i, 'ze słabo odgraniczoną, wyniosłą zmianą$1'],
        [/\bzsolwzm([ .,:;])/i, 'ze słabo odgraniczoną, lekko wyniosłą zmianą$1'],
        [/\bzsoozm([ .,:;])/i, 'ze słabo odgraniczoną, owrzodziałą zmianą$1'],
        [/\bzsobzm([ .,:;])/i, 'ze słabo odgraniczoną, brodawkowatą zmianą$1'],
        [/\bddgc([ .,:;])/i, 'dochodzącą do granicy cięcia$1'],
        // pęcherzyki
        [/\bpz([ .,:;])/i, 'pęcherzyk żółciowy$1'],
        [/\bopz([ .,:;])/i, 'opróżniony pęcherzyk żółciowy$1'],
        [/\bcopz([ .,:;])/i, 'częściowo opróżniony pęcherzyk żółciowy$1'],
        [/\bbpbpz([ .,:;])/i, 'błona pęcherzyka bez podejrzanych zmian$1'],
        // fragmenty
        [/\bfrt([ .,:;])/i, 'fragment tkankowy$1'],
        [/\b2frt([ .,:;])/i, 'dwa fragmenty tkankowe$1'],
        [/\b3frt([ .,:;])/i, 'trzy fragmenty tkankowe$1'],
        [/\b4frt([ .,:;])/i, 'cztery fragmenty tkankowe$1'],
        [/\b5frt([ .,:;])/i, 'pięć fragmentów tkankowych$1'],
        [/\bpmt([ .,:;])/i, 'pofragmentowany materiał tkankowy$1'],
        [/\bpmkt([ .,:;])/i, 'pofragmentowany materiał kostno-tkankowy$1'],
        [/\bfrtt([ .,:;])/i, 'fragment tkanki tłuszczowej$1'],
        [/\b2frtt([ .,:;])/i, 'dwa fragmenty tkanki tłuszczowej$1'],
        [/\b3frtt([ .,:;])/i, 'trzy fragmenty tkanki tłuszczowej$1'],
        [/\b4frtt([ .,:;])/i, 'cztery fragmenty tkanki tłuszczowej$1'],
        [/\b5frtt([ .,:;])/i, 'pięć fragmentów tkanki tłuszczowej$1'],
        [/\bgtt([ .,:;])/i, 'guz tkanki tłuszczowej$1'],
        [/\bfrj([ .,:;])/i, 'fragment jelita$1'],
        [/\bfrjg([ .,:;])/i, 'fragment jelita grubego$1'],
        [/\bfrjc([ .,:;])/i, 'fragment jelita cienkiego$1'],
        [/\bfrgp([ .,:;])/i, 'fragment gruczołu piersiowego$1'],
        [/\bzfrs([ .,:;])/i, 'z fragmentem skóry$1'],
        [/\bzoss([ .,:;])/i, 'z osełką skóry$1'],
        [/\bzwch([ .,:;])/i, 'z węzłem chłonnym$1'],
        [/\bz2wch([ .,:;])/i, 'z dwoma węzłami chłonnymi$1'],
        [/\bz3wch([ .,:;])/i, 'z trzema węzłami chłonnymi$1'],
        [/\bz4wch([ .,:;])/i, 'z czterema węzłami chłonnymi$1'],
        [/\bz5wch([ .,:;])/i, 'z pięcioma węzłami chłonnymi$1'],
        [/\bz6wch([ .,:;])/i, 'z sześcioma węzłami chłonnymi$1'],
        [/\bz7wch([ .,:;])/i, 'z siedmioma węzłami chłonnymi$1'],
        [/\bz8wch([ .,:;])/i, 'z ośmioma węzłami chłonnymi$1'],
        [/\bz9wch([ .,:;])/i, 'z dziewięcioma węzłami chłonnymi$1'],
        // wymiary i spostrzeżenia
        [/\bowym([ .,:;])/i, 'o wymiarach$1'],
        [/\bolwym([ .,:;])/i, 'o łącznych wymiarach$1'],
        [/\bodl([ .,:;])/i, 'o długości$1'],
        [/\boldl([ .,:;])/i, 'o łącznej długości$1'],
        [/\bosr([ .,:;])/i, 'o średnicy$1'],
        [/\bogr([ .,:;])/i, 'o grubości$1'],
        [/\bwodl([ .,:;])/i, 'w odległości$1'],
        [/\bnagl([ .,:;])/i, 'na głębokość$1'],
        [/\bnap([ .,:;])/i, 'na przekroju$1'],
        [/\bbpz([ .,:;])/i, 'bez podejrzanych zmian$1'],
        [/\bbpo([ .,:;])/i, 'bez podejrzanych ognisk$1'],
        [/\bbot([ .,:;])/i, 'bez oznaczeń topograficznych$1'],
        [/\bpmp([ .,:;])/i, 'pozostałe marginesy powyżej$1'],
        // kwadranty
        [/\bw kwg([ .,:;])/i, 'w kwadrancie wewnętrznym górnym$1'],
        [/\bw kwd([ .,:;])/i, 'w kwadrancie wewnętrznym dolnym$1'],
        [/\bw kzd([ .,:;])/i, 'w kwadrancie zewnętrznym dolnym$1'],
        [/\bw kzg([ .,:;])/i, 'w kwadrancie zewnętrznym górnym$1'],
        [/\bw kgw([ .,:;])/i, 'w kwadrancie górnym wewnętrznym$1'],
        [/\bw kdw([ .,:;])/i, 'w kwadrancie dolnym wewnętrznym$1'],
        [/\bw kdz([ .,:;])/i, 'w kwadrancie dolnym zewnętrznym$1'],
        [/\bw kgz([ .,:;])/i, 'w kwadrancie górnym zewnętrznym$1'],
        [/\bkwg([ .,:;])/i, 'kwadrant wewnętrzny górny$1'],
        [/\bkwd([ .,:;])/i, 'kwadrant wewnętrzny dolny$1'],
        [/\bkzd([ .,:;])/i, 'kwadrant zewnętrzny dolny$1'],
        [/\bkzg([ .,:;])/i, 'kwadrant zewnętrzny górny$1'],
        [/\bkgw([ .,:;])/i, 'kwadrant górny wewnętrzny$1'],
        [/\bkdw([ .,:;])/i, 'kwadrant dolny wewnętrzny$1'],
        [/\bkdz([ .,:;])/i, 'kwadrant dolny zewnętrzny$1'],
        [/\bkgz([ .,:;])/i, 'kwadrant górny zewnętrzny$1'],
        [/\bngkw([ .,:;])/i, 'na granicy kwadrantów wewnętrznych$1'],
        [/\bngkz([ .,:;])/i, 'na granicy kwadrantów zewnętrznych$1'],
        [/\bngkg([ .,:;])/i, 'na granicy kwadrantów górnych$1'],
        [/\bngkd([ .,:;])/i, 'na granicy kwadrantów dolnych$1'],
        // marginesy
        [/\bdo mmin([ .,:;])/i, 'do marginesu minimalnego$1'],
        [/\bdo mbo([ .,:;])/i, 'do marginesu bocznego$1'],
        [/\bdo mprzy([ .,:;])/i, 'do marginesu przyśrodkowego$1'],
        [/\bdo mprze([ .,:;])/i, 'do marginesu przedniego$1'],
        [/\bdo mgl([ .,:;])/i, 'do marginesu głębokiego$1'],
        [/\bdo mgł([ .,:;])/i, 'do marginesu głębokiego$1'],
        [/\bdo mgo([ .,:;])/i, 'do marginesu górnego$1'],
        [/\bdo mgó([ .,:;])/i, 'do marginesu górnego$1'],
        [/\bdo mdo([ .,:;])/i, 'do marginesu dolnego$1'],
        [/\bdo mch([ .,:;])/i, 'do marginesu chirurgicznego$1'],
        [/\bw mmin([ .,:;])/i, 'w marginesie minimalnym$1'],
        [/\bw mbo([ .,:;])/i, 'w marginesie bocznym$1'],
        [/\bw mprzy([ .,:;])/i, 'w marginesie przyśrodkowym$1'],
        [/\bw mprze([ .,:;])/i, 'w marginesie przednim$1'],
        [/\bw mgl([ .,:;])/i, 'w marginesie głębokim$1'],
        [/\bw mgł([ .,:;])/i, 'w marginesie głębokim$1'],
        [/\bw mgo([ .,:;])/i, 'w marginesie górnym$1'],
        [/\bw mgó([ .,:;])/i, 'w marginesie górnym$1'],
        [/\bw mdo([ .,:;])/i, 'w marginesie dolnym$1'],
        [/\bw mch([ .,:;])/i, 'w marginesie chirurgicznym$1'],
        [/\bw okolicy mmin([ .,:;])/i, 'w okolicy marginesu minimalnego$1'],
        [/\bw okolicy mbo([ .,:;])/i, 'w okolicy marginesu bocznego$1'],
        [/\bw okolicy mprzy([ .,:;])/i, 'w okolicy marginesu przyśrodkowego$1'],
        [/\bw okolicy mprze([ .,:;])/i, 'w okolicy marginesu przedniego$1'],
        [/\bw okolicy mgl([ .,:;])/i, 'w okolicy marginesu głębokiego$1'],
        [/\bw okolicy mgł([ .,:;])/i, 'w okolicy marginesu głębokiego$1'],
        [/\bw okolicy mgo([ .,:;])/i, 'w okolicy marginesu górnego$1'],
        [/\bw okolicy mgó([ .,:;])/i, 'w okolicy marginesu górnego$1'],
        [/\bw okolicy mdo([ .,:;])/i, 'w okolicy marginesu dolnego$1'],
        [/\bw okolicy mch([ .,:;])/i, 'w okolicy marginesu chirurgicznego$1'],
        [/\bmmin([ .,:;])/i, 'margines minimalny$1'],
        [/\bmbo([ .,:;])/i, 'margines boczny$1'],
        [/\bmprzy([ .,:;])/i, 'margines przyśrodkowy$1'],
        [/\bmprze([ .,:;])/i, 'margines przedni$1'],
        [/\bmgl([ .,:;])/i, 'margines głęboki$1'],
        [/\bmgł([ .,:;])/i, 'margines głęboki$1'],
        [/\bmty([ .,:;])/i, 'margines tylny$1'],
        [/\bmgo([ .,:;])/i, 'margines górny$1'],
        [/\bmgó([ .,:;])/i, 'margines górny$1'],
        [/\bmdo([ .,:;])/i, 'margines dolny$1'],
        [/\bmch([ .,:;])/i, 'margines chirurgiczny'],
        // inne
        [/\bmięśniak([ .,:;])/i, 'szary, lity guz o wyglądzie mięśniaka$1'],
        [/\bmięśniaki([ .,:;])/i, 'szare, lite guzy o wyglądzie mięśniaków$1'],
        // duża litera po kropce:
        [/(^|\.\s+)(.)/g, (...a)=>{return a[1]+a[2].toUpperCase()}]
    ]
    element.addEventListener('input', (e) => {
        let start = e.target.selectionStart - e.target.value.length;
        let end = e.target.selectionEnd - e.target.value.length;
        for (let abbr of abbrs) {
            e.target.value = e.target.value.replace(...abbr)
        }
        e.target.setSelectionRange(start + e.target.value.length, end + e.target.value.length);
    })
}