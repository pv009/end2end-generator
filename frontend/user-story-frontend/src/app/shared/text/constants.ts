import { Context } from '../model/context.model';
import { UserRole } from '../model/user-roles.model';

export let contexts: Array<Context> = [
    { // 0
        mainContext: 'User-Verwaltung',
        subContext: 'Registrierung',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Der Nutzer erhält eine Bestätigungs-Mail',
            'Formular-Absendung führt zur Erstellung eines Nutzer-Accounts'
        ]
    },
    { // 1
        mainContext: 'User-Verwaltung',
        subContext: 'Login',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Formular-Absendung führt zu Login des Nutzers'
        ]
    },
    { // 2
        mainContext: 'User-Verwaltung',
        subContext: 'Passwort vergessen',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Der Login-Bereich erhält einen Passwort vergessen Link',
            'Der Nutzer erhält eine E-Mail zum zurücksetzen des Passworts'
        ]
    },
    { // 3
        mainContext: 'User-Verwaltung',
        subContext: 'Passwort ändern',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Der Nutzer-Bereich erhält einen Passwort ändern Link',
            'Der Nutzer erhält eine E-Mail zum zurücksetzen des Passworts'
        ]
    },
    { // 4
        mainContext: 'User-Verwaltung',
        subContext: 'Nutzerdaten ändern',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Der Nutzer-Bereich erhält einen Link zum Formular',
            'Die Daten des Nutzers aktualisieren sich nach Formular-Absendung'
        ]
    },
    { // 5
        mainContext: 'Gesuche',
        subContext: 'Übersicht',
        acceptanceCriteria: [
            'Der Nutzer kann ein Einzelgesuch ausklappen, um alle Daten zu sehen',
            'Der Nutzer kann Filter einstellen',
            'Es werden pro Seite 30 Ergebnisse gezeigt',
            'Ein Ergebnis enthält mindestens den Titel',
            'Der Nutzer kann ein Ergebnis anklicken und kommt auf die Detailseite',
            'Der Nutzer erhält ein Suchformular',
            'Der Nutzer kann zwischen den Seiten navigieren'
        ]
    },
    { // 6
        mainContext: 'Gesuche',
        subContext: 'Detailansicht',
        acceptanceCriteria: [
            'Der Nutzer kann mit dem Gesuch Kontakt aufnehmen',
            'Der Nutzer sieht folgende Daten des Gesuchs in der Detailansicht…',
            'Der Nutzer kann zurück zur Übersicht springen'
        ]
    },
    { // 7
        mainContext: 'Gesuche',
        subContext: 'Anlage',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Absendung des Formulars führt zur Anlage des Gesuchs',
            'Der Nutzer kann Tags eingeben',
            'Der Nutzer erhält eine Vorschau',
            'Der Nutzer kann das Gesuch veröffentlichen',
            'Der Nutzer kann das Gesuch speichern'
        ]
    },
    { // 8
        mainContext: 'Gesuche',
        subContext: 'Bearbeitung',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung'
        ]
    },
    { // 9
        mainContext: 'Gesuche',
        subContext: 'Filter',
        acceptanceCriteria: [
            'Der Nutzer kann nach Fachrichtung filtern',
            'Der Nutzer kann nach Disziplin filtern',
            'Der Nutzer kann nach Spezialisierung filtern'
        ]
    },
    { // 10
        mainContext: 'Profile',
        subContext: 'Übersicht',
        acceptanceCriteria: [
            'Der Nutzer kann Filter einstellen',
            'Es werden pro Seite 30 Ergebnisse gezeigt',
            'Ein Ergebnis enthält mindestens den Titel',
            'Der Nutzer kann ein Ergebnis anklicken und kommt auf die Detailseite',
            'Der Nutzer erhält ein Suchformular',
            'Der Nutzer kann zwischen den Seiten navigieren'
        ]
    },
    { // 11
        mainContext: 'Profile',
        subContext: 'Detailansicht',
        acceptanceCriteria: [
            'Der Nutzer kann mit dem Profil Kontakt aufnehmen',
            'Der Nutzer sieht folgende Daten des Gesuchs in der Detailansicht…',
            'Der Nutzer kann zurück zur Übersicht springen'
        ]
    },
    { // 12
        mainContext: 'Profile',
        subContext: 'Anlage',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
            'Absendung des Formulars führt zur Anlage des Profils',
            'Der Nutzer kann Tags eingeben',
            'Der Nutzer erhält eine Vorschau',
            'Der Nutzer kann das Profil veröffentlichen',
            'Der Nutzer kann das Profil speichern'
        ]
    },
    { // 13
        mainContext: 'Profile',
        subContext: 'Bearbeitung',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung'
        ]
    },
    { // 14
        mainContext: 'Profile',
        subContext: 'Forschungsreferenzen',
        acceptanceCriteria: [
            'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) hinzufügen',
            'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) bearbeiten',
            'Der Nutzer kann eine Forschungsreferenz (Projekt, Publikation oder Schwerpunkt) löschen',
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung',
        ]
    },
    { // 15
        mainContext: 'Chat',
        subContext: 'Übersicht',
        acceptanceCriteria: [
            'Der Nutzer sieht seine vorhandenen Chats mit Bild, Namen und letzter Nachricht',
            'Der Nutzer kann einen Chat auswählen',
            'Der Chat wird im Einzelchat-Bereich angezeigt',
        ]
    },
    { // 16
        mainContext: 'Chat',
        subContext: 'Einzelchat',
        acceptanceCriteria: [
            'Der Nutzer sieht bisherige Chatnachrichten',
            'Der Nutzer kann eine neue Nachricht eintippen',
            'Der Nutzer kann die Nachricht absenden',
            'Die neue Nachricht wird im Chat angezeigt',
        ]
    },
    { // 17
        mainContext: 'Kontakt',
        subContext: 'Support',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung'
        ]
    },
    { // 18
        mainContext: 'Kontakt',
        subContext: 'Feedback',
        acceptanceCriteria: [
            'Der Nutzer erhält ein Formular',
            'Der Nutzer kann das Formular absenden',
            'Der Nutzer erhält eine Erfolgsmeldung'
        ]
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
