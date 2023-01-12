// ==UserScript==
// @name         Nakładka Brzozów
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Nakładka na program PatARCH opracowana na potrzeby Zakładu Patomorfologii Brzozów.
// @author       Piotr Milczanowski
// @match        https://brzozow.patarch.medlan.pl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

setTimeout(function () {
    'use strict';
    console.log('Nakładka Brzozów w wersji 0.1.1');

    // Weryfikacja całości materiału. Patrz zgłoszenie [MedLAN#5209886].
    if (window.location.href.match(/analysis_(new|edit)/)) {
        let used = document.querySelector('#m_used_entirely');
        if (!selectedEmpty() && selectedHasAnalysis() && used.checked) {
            used.checked = false;
            displayText('Skorygowano pozycję "Mat. zużyty w całości?"', 'Wewnątrzzakładowa korekta błędu. Patrz zgłoszenie [MedLAN#5209886].', 260);
        }
    }
    // Dodatkowe skróty klawiszowe
    if (window.location.href.match(/analysis_(new|edit)/)) {
        let moreFixation = document.querySelector('#a_more_fixation');
        addKeyboardShortcut(moreFixation, 'd', { ctrl: true })
    }
    //
    //
    //
    //
    // skróty wewnątrzzakładowe
    if (false && window.location.href.match(/analysis_(new|edit)/)) {
        let macro = document.querySelector('#m_macro_img');
        let count = document.querySelector('#a_sample_count');
        const wycinki = [
            'Zero wycinków ',
            'Jeden wycinek ',
            'Dwa wycinki ',
            'Trzy wycinki ',
            'Cztery wycinki ',
            'Pięć wycinków ',
            'Sześć wycinków ',
            'Siedem wycinków ',
            'Osiem wycinków ',
            'Dziewięć wycinków ',
            'Dziesięć wycinków ',
            'Jedenaście wycinków ',
            'Dwanaście wycinków ',
            'Trzynaście wycinków ',
            'Czternaście wycinków ',
            'Piętnaście wycinków ',
            'Szesnaście wycinków ',
            'Siedemnaście wycinków ',
            'Osiemnaście wycinków ',
            'Dziewiętnaście wycinków ',
            'Dwadzieścia wycinków ',
        ]
        // TODO: przenieść skróty z AutoHotKey
        macro.addEventListener('input', function (e) {
            let start = macro.selectionStart;
            let end = macro.selectionEnd;
            let startingLength = macro.value.length;
            let match = macro.value.match(/^([0-9]+)w /);
            if (match) {
                count.value = match[1];
                macro.value = macro.value.replace(/^([0-9]+)w /, wycinki[match[1]])
                macro.setSelectionRange(start - startingLength + macro.value.length, end - startingLength + macro.value.length);
            }

        });
    }
    // hasło w kodzie
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
    }
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
            if (element.hasAttribute('checked')) {
                element.checked = !element.checked;
            }
        }
    });
    let hint = document.createElement('span');
    hint.classList.add('form-descr');
    hint.innerHTML += `&nbsp[${ctrl ? 'Ctrl+' : ''}${key.toUpperCase()}]&nbsp`;
    element.after(hint)
}