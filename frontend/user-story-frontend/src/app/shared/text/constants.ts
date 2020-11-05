import { Context } from '../model/context.model';
import { UserRole } from '../model/user-roles.model';

export let contexts: Array<Context> = [
    { // 0
        mainContext: 'User-Verwaltung',
        subContext: 'Registrierung'
    },
    { // 1
        mainContext: 'User-Verwaltung',
        subContext: 'Login'
    },
    { // 2
        mainContext: 'User-Verwaltung',
        subContext: 'Passwort vergessen'
    },
    { // 3
        mainContext: 'User-Verwaltung',
        subContext: 'Passwort ändern'
    },
    { // 4
        mainContext: 'User-Verwaltung',
        subContext: 'Nutzerdaten ändern'
    },
    { // 5
        mainContext: 'Gesuche',
        subContext: 'Übersicht'
    },
    { // 6
        mainContext: 'Gesuche',
        subContext: 'Detailansicht'
    },
    { // 7
        mainContext: 'Gesuche',
        subContext: 'Anlage'
    },
    { // 8
        mainContext: 'Gesuche',
        subContext: 'Bearbeitung'
    },
    { // 9
        mainContext: 'Gesuche',
        subContext: 'Filter'
    },
    { // 10
        mainContext: 'Profile',
        subContext: 'Übersicht'
    },
    { // 11
        mainContext: 'Profile',
        subContext: 'Detailansicht'
    },
    { // 12
        mainContext: 'Profile',
        subContext: 'Anlage'
    },
    { // 13
        mainContext: 'Profile',
        subContext: 'Bearbeitung'
    },
    { // 14
        mainContext: 'Profile',
        subContext: 'Forschungsreferenzen'
    },
    { // 15
        mainContext: 'Chat',
        subContext: 'Übersicht'
    },
    { // 16
        mainContext: 'Chat',
        subContext: 'Einzelchat'
    },
    { // 17
        mainContext: 'Kontakt',
        subContext: 'Support'
    },
    { // 18
        mainContext: 'Kontakt',
        subContext: 'Feedback'
    }
];

export let userRoles: Array<UserRole> = [
    {
        name: 'nicht-registrierter Nutzer',
        correspondingContexts: [
            contexts[0],
            contexts[5],
            contexts[6],
            contexts[9],
            contexts[10],
            contexts[11],
            contexts[17],
            contexts[18],
        ]
    },
    {
        name: 'ausgeloggter Nutzer',
        correspondingContexts: [
            contexts[1],
            contexts[2],
            contexts[3],
            contexts[5],
            contexts[6],
            contexts[9],
            contexts[10],
            contexts[11],
            contexts[17],
            contexts[18],
        ]
    },
    {
        name: 'eingeloggter Nutzer',
        correspondingContexts: contexts.slice(3)
    },
    {
        name: 'Vertreter einer Forschungseinrichtung',
        correspondingContexts: contexts
    },
    {
        name: 'Vertreter eines Unternehmens',
        correspondingContexts: contexts
    },
    {
        name: 'erstmaliger Besucher des Portals',
        correspondingContexts: [
            contexts[0],
            contexts[5],
            contexts[6],
            contexts[9],
            contexts[10],
            contexts[11],
            contexts[17],
            contexts[18],
        ]
    }
];
