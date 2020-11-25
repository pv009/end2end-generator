export interface FAQs {
    title: string;
    faqs: Array<SingleFAQ>;
}

export interface SingleFAQ {
    question: string;
    answer: string;
}

export let registerFAQs: FAQs = {
    title: 'registerFAQ',
    faqs: [
        {
            question: 'Wie registrieren Sie sich auf der Forschungsplattform von Edecy?',
            answer: 'Die Registrierung erfolgt durch das Anlegen eines Nutzerkontos, in dem Sie Informationen wie Name ' +
                'und Adresse zu sich und Ihrer Organisation eintragen. Anschließend wählen Sie ein Passwort und können' +
                ' optional ein Logo Ihrer Organisation hochladen. Durch die Registrierung werden keine Kosten fällig und' +
                ' eine Anmeldung zu dem Edecy-Newsletter findet nur nach Ihrer ausdrücklichen Zustimmung statt. Nach dem ' +
                'Abschluss der Registrierung können Sie in einem separaten Schritt ein ausführlicheres Forschungsprofil für' +
                ' Ihre Organisation anlegen und diesem konkrete Kooperationsgesuche hinzufügen.'
        },
        {
            question: 'Wie werden sensible Daten meines Unternehmens geschützt?',
            answer: 'Es kann sein, dass Ihre Kooperationsgesuche sensible Daten enthalten, die Mitbewerbern nicht in die Hände' +
                ' fallen sollten. Für solche Fälle bietet Edecy die Möglichkeit ein Gesuch entweder „öffentlich“ oder „privat“ zu ' +
                'erstellen. Schalten Sie Ihr Gesuch auf privat, ist es nicht mehr öffentlich für andere Nutzer sichtbar. Ein Matching' +
                ' kann dann nur noch über das Edecy-Team erfolgen, welches mit einem geeigneten Partner auf Sie zukommt. Zusätzlich ' +
                'werden auch öffentliche Forschungsprofile und -gesuche nur für ebenfalls registrierte Nutzer vollständig angezeigt.'
        },
        {
            question: 'Wie erfolgt die Vorqualifizierung der Partner durch Edecy?',
            answer: 'Bevor Ihnen von Edecy mögliche Kooperationspartner vorgeschlagen werden, durchlaufen diese eine Vorqualifizierung ' +
                'durch unser Partnernetzwerk und einen telefonischen Austausch mit Ihrem persönlichen Edecy Ansprechpartner. Hierbei ' +
                'werden potenzielle Partner auf Seriosität und fachliche Eignung geprüft. Dadurch stellt Edecy sicher, dass Sie nur ' +
                'Kooperationsvorschläge erhalten, die bereits präzise das von Ihnen gesuchte Kompetenzprofil widerspiegeln. Dies spart ' +
                'Zeit, die Sie anschließend in die tatsächliche Forschungskooperation investieren können.'
        },
        {
            question: 'Wie funktioniert der Edecy Matching-Algorithmus?',
            answer: 'In herkömmlichen Forschungsdatenbanken findet die Suche nach spezifischen Forschungspartnern und -projekten ' +
                'durch einen einfachen Schlagwort-Abgleich statt. Diese Technik stößt dort an Ihre Grenzen, wo spezifische Keywords sich ' +
                'aus mehreren Teilbegriffen zusammensetzen (z.B. Neuronales Netzwerk oder Digitaler Zwilling) und nur innerhalb der ' +
                'Fließtexte von Projektbeschreibungen und Forschungspublikationen enthalten sind. Um dieses Problem zu lösen, setzt der ' +
                'Edecy Suchalgorithmus auf die intelligente Analyse wissenschaftlicher Fachsprache mittels Natural Language Processing. ' +
                'Hierdurch werden mehrteilige Fachbegriffe als eine semantische Einheit erkannt und können auch in unterschiedlichen ' +
                'grammatikalischen Formen erkannt werden. So können Forschungsprofile und -gesuche effizienter durchsucht werden und ' +
                'ein präzises Matching wird möglich.'
        },
        {
            question: 'Welche Vorteile bieten Forschungskooperationen für Ihr Unternehmen?',
            answer: 'Die Vorteile von Forschungskooperationen sind vielfältig. Besonders kleine und mittelständische Unternehmen ' +
                'stoßen im Zuge eines Anstiegs der Komplexität moderner Forschungsthemen an die Grenzen internen Entwicklungskapazitäten ' +
                '– Innovationen bleiben häufig Großunternehmen überlassen. Durch Forschungskooperationen können Sie finanzielle ' +
                'Ressourcen effizienter nutzen und von dem fachlichen Know-How Ihrer Partner profitieren. Insgesamt gewinnt Ihr ' +
                'Unternehmen so an Gestaltungsfähigkeit und bleibt langfristig wettbewerbsfähig.'
        }
    ]
};

export let mainFAQs: FAQs = {
    title: 'mainFAQ',
    faqs: [
        {
            question: 'Wie funktioniert die Edecy Plattform?',
            answer: 'Die Edecy Plattform bietet allen registrierten Nutzern die Möglichkeit Gebotsanzeigen zu erstellen, um potentielle ' +
                'Partner zu gemeinsamen Projekten einzuladen, die eigenen Forschungskompetenzen darzustellen und von interessierten ' +
                'Partnern gefunden zu werden. Über Gesuche können Nutzer aktiv beschreiben, für welche Idee oder welche Aufgabe noch ' +
                'ein Partner benötigt wird. Die Anzeigen werden von allen Nutzern durchsucht und die jeweiligen potentiellen Partner ' +
                'können bei Interesse direkt in der App angesprochen werden.'
        },
        {
            question: 'Warum ist Edecy eine Plattform-Lösung?',
            answer: 'Wir glauben, dass Sie als Kunde Experten Sachen Forschung und Entwicklung sind und am besten bewerten können, ' +
                'was Sie für Ihren geschäftlichen Erfolg brauchen. Die Plattform soll Ihnen helfen schnell und übersichtlich Zugang zu ' +
                'den benötigten Partnern zu erhalten ohne viel Zeit und Geld zu investieren.'
        },
        {
            question: 'Was bedeutet Campus, Maschine, Projekt?',
            answer: 'Mit diesen drei Kategorien verschaffen wir Ihnen einen besseren Überblick der für sie relevanten Anzeigen. ' +
                '"Campus" betrifft alle Kooperationen mit Universitäten, "Maschine" das zur Verleihen oder Anfragen von Maschinen und ' +
                '"Projekt" sämtliche größeren Kooperationsvorhaben. Details hierzu finden Sie auch im Tooltip.'
        },
        {
            question: 'Was kostet mich die Plattform?',
            answer: 'Nichts. Egal ob Sie Anzeigen einstellen oder selbst die Plattform durchsuchen wollen ist die Benutzung der ' +
                'Edecy Plattform im Rahmen unserer AGB in vollem Funktionsumfang kostenlos. Probieren Sie es aus - Sie gehen kein ' +
                'Risiko ein! Falls Sie weitere Unterstützung brauchen und wir beispielsweise Aktiv über andere Kanäle nach Partnern ' +
                'für Sie suchen sollen, finden sie hier unser Angebot.'
        },
        {
            question: 'Welche Daten muss ich angeben und wie werden diese behandelt?',
            answer: 'Für die Registrierung und die volle Benutzung der Plattform müssen Sie einige persönliche Daten angeben. Da ' +
                'das Ziel der Plattform die Kommunikation ist, ist dies unabdingbar. Sie können allerdings für jede Anzeige individuell ' +
                'angeben, welche Informationen einsehbar sein sollen und welche nicht. Zudem können Sie auch eine Anzeige mit Ihren ' +
                'Informationen durch uns erstellen lassen die dann als "Managed by Edecy" angezeigt wird. Der Kontakt läuft dann ' +
                'vollständig über uns. Details zum Datenschutz finden Sie im Übrigen in unserer Datenschutzerklärung.'
        },
        {
            question: 'Kann ich die Edecy Dienstleistung direkt über die Plattform nutzen?',
            answer: 'Ja! Im Prozess der Anzeigeerstellung besteht direkt die Möglichkeit das Problem anstelle zur Plattform auch ' +
                'direkt an Edecy Mitarbeiter zu senden, damit wir aktiv auch außerhalb der Plattform nach den richtigen Ansprechpartnern ' +
                'für Sie suchen. Hinweis: Diese Dienstleistung ist mit Kosten verbunden, über die wir auf unserer Preise-Seite aufklären ' +
                'und die individuell vereinbart werden.'
        },
        {
            question: 'Muss ich ein Gesuch eingeben um gefunden zu werden?',
            answer: 'Ja! Die persönlichen Informationen, die bei der Registrierung hinterlegt werden sind nicht auf der Plattform ' +
                'sichtbar. Um gefunden zu werden müssen Sie also die für das jeweilige Projekt oder den jeweiligen Forschungsbereich ' +
                'relevanten Informationen über die Gesuche veröffentlichen.'
        },
        {
            question: 'Lege ich ein Profil für mich oder meine Firma an?',
            answer: 'Alle Nutzer sind personengebunden. Dies ist wichtig, damit hinter jeder Anzeige auch ein bestimmter ' +
                'Ansprechpartner steht, mit dem Interessenten in Kontakt treten können. Es sollten allerdings auch Informationen ' +
                'über die dahinterstehende Organisation hinterlegt werden, damit andere Nutzer wissen, mit wem Sie es zu tun haben.'
        },
        {
            question: 'Kann jeder meine Projekte sehen?',
            answer: 'Sie können für jede Anzeige eigene Privatsphäre-Einstellungen anpassen und so entscheiden, welche ' +
                'Informationen mit welchen Besuchern der Seite geteilt werden. Dies lässt sich über den Anzeigenmanager auch ' +
                'im Nachhinein stets anpassen.'
        }
    ]
};
