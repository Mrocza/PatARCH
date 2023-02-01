// ==UserScript==
// @name         Nakładka Brzozów
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Nakładka na program PatARCH opracowana na potrzeby Zakładu Patomorfologii Brzozów.
// @author       Piotr Milczanowski
// @homepage     https://github.com/Mrocza/PatARCH
// @match        https://brzozow.patarch.medlan.pl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==



setTimeout(function () {
    'use strict';
    console.log('Nakładka Brzozów w wersji 0.5.1');

    // Weryfikacja całości materiału. Patrz zgłoszenie [MedLAN#5209886].
    if (window.location.href.match(/analysis_(new|edit)/)) {
        var usedEntirely = document.querySelector('#m_used_entirely');
        if (!selectedEmpty() && selectedHasAnalysis() && usedEntirely.checked) {
            usedEntirely.checked = false;
            displayText('Skorygowano pozycję "Mat. zużyty w całości?"', 'Wewnątrzzakładowa korekta błędu. Patrz zgłoszenie [MedLAN#5209886].', 260);
        }
    }
    // Zaznaczenie całości textu w polu lokalizacji
    if (window.location.href.match(/localization_(edit|new)/)) {
        document.querySelector('input[type=text]#l_description').select();
    }
    // Dodatkowe skróty klawiszowe
    var moreFixation = document.querySelector('input[type=checkbox]#a_more_fixation');
    addKeyboardShortcut(moreFixation, 'd', { ctrl: true });
    var sampleFragmented = document.querySelector('input[type=checkbox]#a_sample_fragmented');
    addKeyboardShortcut(sampleFragmented, 'r', { ctrl: true });
    // Skróty wewnątrzzakładowe
    enableAbbriviations(document.querySelector('textarea#m_macro_img'));
    enableAbbriviations(document.querySelector('textarea#m_notes'));
    enableAbbriviations(document.querySelector('input[type=text]#l_description'));
    // Strony startowe dla stanowisk pracy
    setTimeout(function () {
        if (window.location.href.match(/menu\/start\/(|\?place_was_changed=)1$/)) {
            if (getLocation() == 'Pracownia Histopatologii - Zatapianie') {
                document.location = '/workplace/embedding';
            }
            if (getLocation() == 'Pracownia Histopatologii - Intra') {
                document.location = '/workplace/disposal';
            }
        }
    }, 900);
    // Hasło w kodzie
    document.addEventListener('keydown', function (e) {
        var loginInput = document.querySelector('#user_login');
        var passInput = document.querySelector('#user_password');
        if (e.key == 'F3' && passInput) {
            e.preventDefault();
            passInput.focus();
        }
        if (e.key == 'Enter' && passInput) {
            var credentials = passInput.value; // format kodu: login<br/>hasło
            if (e.getModifierState('CapsLock')) {
                credentials = flipCase(credentials);
            }
            if (!credentials.includes('<br/>')) {
                credentials = atob(credentials);
            }
            if (credentials.includes('<br/>')) {
                e.preventDefault();
                credentials = credentials.split('<br/>');
                if (loginInput) {
                    loginInput.value = credentials[0];
                }
                passInput.value = credentials[1];
                var loginButton = document.querySelector('input[value=Zaloguj]')
                    ?? document.querySelector('input[value="Odblokuj hasłem"]');
                loginButton.click();
            }
        }
    });
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
}, 100);

function displayText(text, hoverText = 'Dodatek PatARCH Brzozów.', width = 200) {
    /*
      Wyświetla informacje w prawym dolnym rogu paska statusu.
    */
    var footer = document.querySelector('#div-main-footer');
    var addonBox = document.querySelector('#addon-box');
    if (!addonBox) {
        addonBox = document.createElement('span');
        addonBox.style.opacity = 0.7;
        addonBox.style.float = 'right';
        addonBox.style.cursor = 'default';
        addonBox.setAttribute('onmouseover', `return overlib('${hoverText}', WIDTH, ${width}, ABOVE, LEFT);`);
        addonBox.setAttribute('onmouseout', 'return nd();');
        footer.appendChild(addonBox);
    }
    addonBox.innerHTML = `${text} |&nbsp`;
}

function getUser() {
    /*
      Zwraca login aktualnie zalogowanej osoby.
    */
    var user = document.querySelector('a.footer_stats_link').innerHTML.match(/\s*(?<fullname>[^(]*) \((?<login>[^)]*)\)/);
    return user.groups.login;
}

function getLocation() {
    /*
      Zwraca miejsce pracy.
    */
    return document.querySelector('.banner_licence').text;
}

function selectedEmpty() {
    /*
      Zwraca true jeżeli aktwny materiał został pobrany w całości.
    */
    var materials = document.querySelector('#sortablelist_m').children;
    for (var material of materials) {
        if (material.querySelector('.scrollSelected')) {
            return material.querySelectorAll('img')[1].src.includes('empty'); // img z indeksem 0 to łącznik, pod 1 jest ikonka pojemnika
        }
    }
    return false;
}

function selectedHasAnalysis() {
    /*
      Zwraca true jeżeli aktywny materiał ma dodane badania.
    */
    var materials = document.querySelector('#sortablelist_m').children;
    for (var material of materials) {
        if (material.querySelector('.scrollSelected')) {
            return material.querySelector('a[context=analysis]') !== null;
        }
    }
    return false;
}

function addKeyboardShortcut(element, key = '', { ctrl = false, shift = false, alt = false }) {
    /*
      Dodaje skrót klawiszowy do wskazanego elementu.
    */
    if (!element) {
        return;
    }
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey == ctrl && e.shiftKey == shift && e.altKey == alt && e.key == key) {
            e.preventDefault();
            if (element && element.type == 'checkbox') {
                element.checked = !element.checked;
                if (element.onchange) {
                    element.onchange();
                }
            }
        }
    });
    if (element) {
        var hint = document.createElement('span');
        hint.classList.add('form-descr');
        hint.innerHTML += `&nbsp[${ctrl ? 'Ctrl+' : ''}${key.toUpperCase()}]&nbsp`;
        element.after(hint);
    }
}

function enableAbbriviations(element) {
    /*
      Uruchamia skróty wewnątrzzakładowe dla wskazanego elementu.
    */
    if (!element) {
        return;
    }
    var abbrs = [
        // zamiany specjalne:
        [/^([0-9]+)w[ .,:;]/i, (...a)=>{var c=document.querySelector('#a_sample_count');if(c)c.value=a[1];return a[0];}],
        [/^(wzksm|wzjm)[ .,:;]/i, (...a)=>{var f=document.querySelector('#a_sample_fragmented');if(f){f.checked=1;f.onchange();}return a[0];}],
        [/wyskrob.*(bcz|bjcz|bccz)[ .,:;]/i, (...a)=>{var m=document.querySelector('#a_more_fixation');if(m&&(new Date()).getDay()!=5)m.checked=1;return a[0];}],
        [/\bDATA([ .,:;])/, ()=>{return (new Date()).toISOString().replace(/([\d-]+)T(\d\d:\d\d).*/,'$1 $2 - ')}],
        [/([0-9\]])mm/, (...a)=>{return element.selectionEnd-a[2]>=3?a[1]+' mm':a[0];}],
        [/([0-9]+)[zxcs]([0-9]+)[zxcs]([0-9]+)([zxcs]|)/, '$1x$2x$3'],
        // materiały drobne
        ['1w', 'jeden wycinek'],
        ['2w', 'dwa wycinki'],
        ['3w', 'trzy wycinki'],
        ['4w', 'cztery wycinki'],
        ['5w', 'pięć wycinków'],
        ['6w', 'sześć wycinków'],
        ['7w', 'siedem wycinków'],
        ['8w', 'osiem wycinków'],
        ['9w', 'dziewięć wycinków'],
        ['10w', 'dziesięć wycinków'],
        ['11w', 'jedenaście wycinków'],
        ['12w', 'dwanaście wycinków'],
        ['13w', 'trzynaście wycinków'],
        ['14w', 'czternaście wycinków'],
        ['15w', 'piętnaście wycinków'],
        ['16w', 'szesnaście wycinków'],
        ['17w', 'siedemnaście wycinków'],
        ['18w', 'osiemnaście wycinków'],
        ['19w', 'dziewiętnaście wycinków'],
        ['20w', 'dwadzieścia wycinków'],
        ['wzksm', 'wyskrobiny z kanału szyjki macicy'],
        ['wzjm', 'wyskrobiny z jamy macicy'],
        ['wpp', 'wyskrobiny po poronieniu'],
        // barwy
        ['bzo', 'barwy żółtej'],
        ['bjzo', 'barwy jasnożółtej'],
        ['bbi', 'barwy białej'],
        ['bsk', 'barwy skóry'],
        ['bsz', 'barwy szarej'],
        ['bszzo', 'barwy szarożółtej'],
        ['bszbr', 'barwy szarobrązowej'],
        ['bszbru', 'barwy szarobrunatnej'],
        ['bjsz', 'barwy jasnoszarej'],
        ['bcsz', 'barwy ciemnoszarej'],
        ['bbr', 'barwy brązowej'],
        ['bjbr', 'barwy jasnobrązowej'],
        ['bcbr', 'barwy ciemnobrązowej'],
        ['bbru', 'barwy brunatnej'],
        ['bcz', 'barwy czerwonej'],
        ['bjcz', 'barwy jasnoczerwonej'],
        ['bccz', 'barwy ciemnoczerwonej'],
        ['bro', 'barwy różowej'],
        ['bjro', 'barwy jasnoróżowej'],
        ['bwi', 'barwy wiśniowej'],
        ['bkr', 'barwy kremowej'],
        ['bsr', 'barwy srebrzystej'],
        ['bsrbi', 'barwy srebrzystobiałej'],
        // skóry
        ['frs', 'fragment skóry'],
        ['oss', 'osełka skóry'],
        ['bzm', 'brodawkowata zmiana'],
        ['zpzm', 'z płaską zmianą'],
        ['zwzm', 'z wyniosłą zmianą'],
        ['zlwzm', 'z lekko wyniosłą zmianą'],
        ['zozm', 'z owrzodziałą zmianą'],
        ['zbzm', 'z brodawkowatą zmianą'],
        ['zsowzm', 'ze słabo odgraniczoną, wyniosłą zmianą'],
        ['zsolwzm', 'ze słabo odgraniczoną, lekko wyniosłą zmianą'],
        ['zsoozm', 'ze słabo odgraniczoną, owrzodziałą zmianą'],
        ['zsobzm', 'ze słabo odgraniczoną, brodawkowatą zmianą'],
        ['ddgc', 'dochodzącą do granicy cięcia'],
        // pęcherzyki
        ['pz', 'pęcherzyk żółciowy'],
        ['opz', 'opróżniony pęcherzyk żółciowy'],
        ['copz', 'częściowo opróżniony pęcherzyk żółciowy'],
        ['bpbpz', 'błona pęcherzyka bez podejrzanych zmian'],
        // fragmenty
        ['frt', 'fragment tkankowy'],
        ['2frt', 'dwa fragmenty tkankowe'],
        ['3frt', 'trzy fragmenty tkankowe'],
        ['4frt', 'cztery fragmenty tkankowe'],
        ['5frt', 'pięć fragmentów tkankowych'],
        ['pmt', 'pofragmentowany materiał tkankowy'],
        ['pmkt', 'pofragmentowany materiał kostno-tkankowy'],
        ['frtt', 'fragment tkanki tłuszczowej'],
        ['2frtt', 'dwa fragmenty tkanki tłuszczowej'],
        ['3frtt', 'trzy fragmenty tkanki tłuszczowej'],
        ['4frtt', 'cztery fragmenty tkanki tłuszczowej'],
        ['5frtt', 'pięć fragmentów tkanki tłuszczowej'],
        ['gtt', 'guz tkanki tłuszczowej'],
        ['frj', 'fragment jelita'],
        ['frjg', 'fragment jelita grubego'],
        ['frjc', 'fragment jelita cienkiego'],
        ['frgp', 'fragment gruczołu piersiowego'],
        ['zfrs', 'z fragmentem skóry'],
        ['zoss', 'z osełką skóry'],
        ['zwch', 'z węzłem chłonnym'],
        ['z2wch', 'z dwoma węzłami chłonnymi'],
        ['z3wch', 'z trzema węzłami chłonnymi'],
        ['z4wch', 'z czterema węzłami chłonnymi'],
        ['z5wch', 'z pięcioma węzłami chłonnymi'],
        ['z6wch', 'z sześcioma węzłami chłonnymi'],
        ['z7wch', 'z siedmioma węzłami chłonnymi'],
        ['z8wch', 'z ośmioma węzłami chłonnymi'],
        ['z9wch', 'z dziewięcioma węzłami chłonnymi'],
        // wymiary i spostrzeżenia
        ['owym', 'o wymiarach'],
        ['olwym', 'o łącznych wymiarach'],
        ['odl', 'o długości'],
        ['oldl', 'o łącznej długości'],
        ['osr', 'o średnicy'],
        ['ogr', 'o grubości'],
        ['wodl', 'w odległości'],
        ['nagl', 'na głębokość'],
        ['nap', 'na przekroju'],
        ['bpz', 'bez podejrzanych zmian'],
        ['bpo', 'bez podejrzanych ognisk'],
        ['bot', 'bez oznaczeń topograficznych'],
        ['pmp', 'pozostałe marginesy powyżej'],
        // kwadranty
        ['w kwg', 'w kwadrancie wewnętrznym górnym'],
        ['w kwd', 'w kwadrancie wewnętrznym dolnym'],
        ['w kzd', 'w kwadrancie zewnętrznym dolnym'],
        ['w kzg', 'w kwadrancie zewnętrznym górnym'],
        ['w kgw', 'w kwadrancie górnym wewnętrznym'],
        ['w kdw', 'w kwadrancie dolnym wewnętrznym'],
        ['w kdz', 'w kwadrancie dolnym zewnętrznym'],
        ['w kgz', 'w kwadrancie górnym zewnętrznym'],
        ['kwg', 'kwadrant wewnętrzny górny'],
        ['kwd', 'kwadrant wewnętrzny dolny'],
        ['kzd', 'kwadrant zewnętrzny dolny'],
        ['kzg', 'kwadrant zewnętrzny górny'],
        ['kgw', 'kwadrant górny wewnętrzny'],
        ['kdw', 'kwadrant dolny wewnętrzny'],
        ['kdz', 'kwadrant dolny zewnętrzny'],
        ['kgz', 'kwadrant górny zewnętrzny'],
        ['ngkw', 'na granicy kwadrantów wewnętrznych'],
        ['ngkz', 'na granicy kwadrantów zewnętrznych'],
        ['ngkg', 'na granicy kwadrantów górnych'],
        ['ngkd', 'na granicy kwadrantów dolnych'],
        // marginesy
        ['do mmin', 'do marginesu minimalnego'],
        ['do mbo', 'do marginesu bocznego'],
        ['do mprzy', 'do marginesu przyśrodkowego'],
        ['do mprze', 'do marginesu przedniego'],
        ['do mgl', 'do marginesu głębokiego'],
        ['do mgł', 'do marginesu głębokiego'],
        ['do mgo', 'do marginesu górnego'],
        ['do mgó', 'do marginesu górnego'],
        ['do mdo', 'do marginesu dolnego'],
        ['do mch', 'do marginesu chirurgicznego'],
        ['w mmin', 'w marginesie minimalnym'],
        ['w mbo', 'w marginesie bocznym'],
        ['w mprzy', 'w marginesie przyśrodkowym'],
        ['w mprze', 'w marginesie przednim'],
        ['w mgl', 'w marginesie głębokim'],
        ['w mgł', 'w marginesie głębokim'],
        ['w mgo', 'w marginesie górnym'],
        ['w mgó', 'w marginesie górnym'],
        ['w mdo', 'w marginesie dolnym'],
        ['w mch', 'w marginesie chirurgicznym'],
        ['w okolicy mmin', 'w okolicy marginesu minimalnego'],
        ['w okolicy mbo', 'w okolicy marginesu bocznego'],
        ['w okolicy mprzy', 'w okolicy marginesu przyśrodkowego'],
        ['w okolicy mprze', 'w okolicy marginesu przedniego'],
        ['w okolicy mgl', 'w okolicy marginesu głębokiego'],
        ['w okolicy mgł', 'w okolicy marginesu głębokiego'],
        ['w okolicy mgo', 'w okolicy marginesu górnego'],
        ['w okolicy mgó', 'w okolicy marginesu górnego'],
        ['w okolicy mdo', 'w okolicy marginesu dolnego'],
        ['w okolicy mch', 'w okolicy marginesu chirurgicznego'],
        ['mmin', 'margines minimalny'],
        ['mbo', 'margines boczny'],
        ['mprzy', 'margines przyśrodkowy'],
        ['mprze', 'margines przedni'],
        ['mgl', 'margines głęboki'],
        ['mgł', 'margines głęboki'],
        ['mty', 'margines tylny'],
        ['mgo', 'margines górny'],
        ['mgó', 'margines górny'],
        ['mdo', 'margines dolny'],
        ['mch', 'margines chirurgiczny'],
        // inne
        ['mięśniak', 'szary, lity guz o wyglądzie mięśniaka'],
        ['mięśniaki', 'szare, lite guzy o wyglądzie mięśniaków'],
    ];
    element.addEventListener('input', (e) => {
        // selection start and end as distance from end of string:
        var start = e.target.value.length - e.target.selectionStart;
        var end = e.target.value.length - e.target.selectionEnd;
        // removes tailing whitespace in front of cursor:
        var frontOfCursor = e.target.value.substring(e.target.value.length-start);
        if (frontOfCursor && !frontOfCursor.trim()) {
            e.target.value = e.target.value.substring(0, e.target.value.length-start);
            // jump selection to end of new string:
            start = 0;
            end = 0;
        }
        // perform replacements while preserving first character case:
        for (var abbr of abbrs) {
            if (typeof abbr[0] == 'string') {
                var re = new RegExp(`\\b${abbr[0]}([ .,:;])`,'i');
                e.target.value = e.target.value.replace(re, (...a) => {
                    if (a[0].charAt(0) != a[0].charAt(0).toUpperCase()) {
                        return abbr[1] + a[1];
                    } else {
                        return abbr[1].charAt(0).toUpperCase() + abbr[1].slice(1) + a[1];
                    }  
                });
            } else {
                e.target.value = e.target.value.replace(...abbr);
            }
        }
        // advance selection forward to account for length of replacement:
        e.target.setSelectionRange(e.target.value.length - start, e.target.value.length - end);
    });
}

function flipCase(inputString) {
    /*
      Funkcja pomocnicza odwracająca kapitalizację znaków w ciągu.
    */
    return inputString.replace(/./g, (m) => {
        return m == m.toUpperCase() ? m.toLowerCase() : m.toUpperCase();
    });
}
