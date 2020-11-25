export interface SingleSubject {
    title: string;
    disciplines: Array<Discipline>;

}

export interface Discipline {
    disciplineTitle: string;
    specialties: Array<string>;
    index: number;
}

export let Subject1: SingleSubject = {
    title: 'Wirtschaftswissenschaften',
    disciplines: [
        {
            disciplineTitle: 'Volkswirtschaftslehre',
            specialties: [
                'Wirtschaftstheorie',
                'Haushaltstheorie',
                'Produktionstheorie',
                'Preistheorie',
                'Spieltheorie',
                'Evolutionsökonomik',
                'Experimentelle Ökonomik',
                'Makroökonomie',
                'Arbeitsökonomik',
                'Außenwirtschaftslehre',
                'Bildungsökonomik',
                'Entwicklungsökonomie',
                'Familienökonomie',
                'Industrieökonomik',
                'Innovationsökonomik',
                'Regionalökonomie',
                'Umweltökonomie',
                'Kulturökonomie',
                'Ökonometrie',
                'Finanzwissenschaft'
            ],
            index: 0
        },
        {
            disciplineTitle: 'Betriebswirtschaft',
            specialties: [
                'Beschaffung, Materialwirtschaft, Logistik',
                'Produktionswirtschaft, Operations Research, Qualitätsmanagement',
                'Absatzwirtschaft, Marketing, Unternehmenskommunikation',
                'Finanzwirtschaft, Investition, Finanzierung, Risikomanagement, Kapitalmärkte',
                'Internes Rechnungswesen, Kostenrechnung, Controlling',
                'Externes Rechnungswesen, Revisions- und Treuhandwesen, Wirtschaftsprüfung',
                'Steuerlehre',
                'Personalwesen',
                'Organisation',
                'Innovations- und Technologiemanagement, Change Management, Wissensmanagement',
                'Strategisches Management, Unternehmensführung',
                'Umweltmanagement',
                'Managementlehre'
            ],
            index: 1
        }
    ]
};

export let Subject2: SingleSubject = {
    title: 'Rechtswissenschaften, Jurisprudenz',
    disciplines: [
        {
            disciplineTitle: 'Rechtswissenschaften',
            specialties: [
                'Rechtsphilosophie, Rechtstheorie',
                'Rechtssoziologie',
                'Familien- und Erbrecht',
                'Gesellschaftsrecht',
                'Steuerrecht',
                'Bilanzrecht',
                'Wettbewerbs- und Kartellrecht',
                'Immaterialgüterrecht, Gewerblicher Rechtsschutz und Urheberrecht',
                'Arbeitsrecht',
                'Betriebsverfassungsrecht, Mitbestimmungsrecht, Personalvertretungsrecht',
                'Internationales Privatrecht',
                'Kriminologie, Strafrecht, Jugendstrafrecht',
                'Baurecht',
                'Wirtschaftsverwaltungsrecht',
                'Umweltschutzrecht',
                'Straßenrecht',
                'Sozialrecht',
                'Völkerrecht',
                'Europarecht'
            ],
            index: 0
        }
    ]
};

export let Subject3: SingleSubject = {
    title: 'Naturwissenschaften',
    disciplines: [
        {
            disciplineTitle: 'Physik',
            specialties: [
                'Membran - Filtertechnologie',
                'Festkörperphysik',
                'Physik der Flüssigkeiten',
                'Strömungsmechanik',
                'Thermodynamik',
                'Laser- und Röntgenphysik',
                'Photonik',
                'Molekulardynamik',
                'Nanotechnologie und Nanomaterialien',
                'Molekulare Maschinen'
            ],
            index: 0
        },
        {
            disciplineTitle: 'Chemie',
            specialties: [
                'Analytische Chemie',
                'Anorganische Chemie',
                'Auftragsforschung - Labore',
                'Chemische Technologie',
                'Chemische Verfahrenstechnik',
                'Elektrochemie - Batteriechemie',
                'Medizinische Chemie',
                'Organische Chemie',
                'Physikalische Chemie - Katalyse',
                'Umweltchemie'
            ],
            index: 1
        },
        {
            disciplineTitle: 'Geowissenschaften',
            specialties: [
                'Geodäsie, Kartografie und Geoinformatik',
                'Geographie',
                'Geophysik und Metereologie',
                'Geologie und Paläontologie',
                'Mineralogie und Petrologie',
                'Hydrologie, Ozenaografie und Glaziologie',
                'Bodenkunde (Pedologie)',
                'Fernerkundung und Photogrammetrie',
                'Geotechnik und Bodenmechanik',
                'Limnologie',
                'Kristallografie',
                'Umweltbeobachtung'
            ],
            index: 2
        },
        {
            disciplineTitle: 'Biologie',
            specialties: [
                'Drug Delivery',
                'Enzymologie - Proteintechnik - Fermentation',
                'Mikrobiologie',
                'Virologie - Bakteriologie - Antibiotika',
                'Molekularbiologie',
                'Botanik',
                'Zoologie',
                'Humanbiologie',
                'Zellbiologie',
                'Genetik',
                'Entwicklungsbiologie',
                'Physiologie',
                'Verhaltensbiologie',
                'Ökologie',
                'Synthetische Biologie',
                'Evolutionsbiologie und Systematik'
            ],
            index: 3
        }
    ]
};

export let Subject4: SingleSubject = {
    title: 'Informationswissenschaften und Mathematik',
    disciplines: [
        {
            disciplineTitle: 'Informationswissenschaften',
            specialties: [
                'Automatentheorie und Formale Sprachen',
                'Berechenbarkeitstheorie',
                'Komplexitätstheorie',
                'Theorie der Programmiersprachen',
                'Theorie der formalen Methoden',
                'Praktische Informatik',
                'Mikroprozessortechnik, Rechnerentwurfsprozess',
                'Architekturen',
                'Maschinennahe Programmierung',
                'Formulierung von Algorithmen als Programme',
                'Betriebssysteme',
                'Steuerungssysteme',
                'Programmiersprachenentwicklung',
                'Künstliche Intelligenz',
                'Signalverarbeitung',
                'Simulation',
                'Datenverarbeitung',
                'Bildverarbeitung'
            ],
            index: 0
        },
        {
            disciplineTitle: 'Mathematik',
            specialties: [
                'Logik und Mengenlehre',
                'Algebra',
                'Analysis',
                'Topologie',
                'Algebraische Geometrie',
                'Algebraische Topologie und Differentialtopologie',
                'Darstellungstheorie',
                'Differentialgeometrie',
                'Diskrete Mathematik',
                'Experimentelle Mathematik',
                'Funktionalanalysis',
                'Geomathematik',
                'Geometrie',
                'Gruppentheorie',
                'Kommutative Algebra',
                'Komplexe Analysis',
                'Lie-Gruppen',
                'Numerische Mathematik',
                'Philosophie der Mathematik',
                'Wahrscheinlichkeitsrechnung',
                'Zahlentheorie'
            ],
            index: 1
        }
    ]
};

export let Subject5: SingleSubject = {
    title: 'Medizintechnik',
    disciplines: [
        {
            disciplineTitle: 'Krankenhaustechnik',
            specialties: [''],
            index: 0
        },
        {
            disciplineTitle: 'Medizinprodukte',
            specialties: [''],
            index: 1
        },
        {
            disciplineTitle: 'Bildgebende Diagnostik',
            specialties: [
                'Sonographie (Ultraschall)',
                'Magnetresonanztomographie (MRT)',
                'Optische Kohärenztomographie (OCT)',
                'Computertomografie (CT)',
                'Mammographie',
                'Angiographie',
                'Nuklearmedizin, Szintigraphie, Positronen-Emissiones-Tomographie (PET)'
            ],
            index: 2
        },
        {
            disciplineTitle: 'Tissue Engineering',
            specialties: [''],
            index: 3
        },
        {
            disciplineTitle: 'Medizinische Informatik',
            specialties: [''],
            index: 4
        }
    ]
};

export let Subject6: SingleSubject = {
    title: 'Ingenieurswissenschaften',
    disciplines: [
        {
            disciplineTitle: 'Maschinenbau',
            specialties: [
                'Fahrzeugbau',
                'Luft- und Raumfahrt',
                'Anlagenbau',
                'Abfülltechnik - Mischtechnik',
                'Drehmaschinen - Drehtechnik',
                'Fertigungstechnik - Konstruktionstechnik',
                'Hydraulik',
                'Industrial Design - Prototypenbau',
                'Industrial Engineering',
                'Maschinenbau',
                'Maschinenteile',
                'Presstechnik - Walztechnik',
                'Pumpen - Kompressoren - Turbinen',
                'Sondermaschinenbau',
                'Technische Mechanik - Feinmechanik',
                'Trenntechnik - Schleiftechnik - Bohrtechnik',
                'Ventiltechnik',
                'Verpackungstechnik',
                'Werkzeugmaschinenbau',
                'Zahnräder - Getriebe',
                'Fördertechnik',
                'Messverfahren & Sensorik',
                'Energietechnik',
                'Robotik'
            ],
            index: 0
        },
        {
            disciplineTitle: 'Bauingenieurwesen',
            specialties: [
                'Baubetrieb und Bauleitung',
                'Bauinformatik',
                'Baustoffkunde, Baustoffprüfung, Bauchemie, Bauphysik',
                'Geotechnik, Bodenmechanik, Felsmechanik, Felsbau und Tunnelbau, Bergbau',
                'Konstruktiver Ingenieurbau, Baustatik, Bauphysik, Baudynamik, Stahlbau, Massivbau, Holzbau, Glasbau, Membranbau',
                'Verkehrswegebau, Straßen- und Wegebau, Verkehrsplanung, Eisenbahnbau, Städtebau',
                'Wasser und Umwelt',
                'Sanierung, Bauen im Bestand'
            ],
            index: 1
        },
        {
            disciplineTitle: 'Elektrotechnik',
            specialties: [
                'Energietechnik',
                'Antriebstechnik',
                'Nachrichtentechnik',
                'Elektrotechnik',
                'Automatisierungstechnik',
                'Elektronische Gerätetechnik',
                'Gebäudetechnik',
                'Theoretische Elektrotechnik',
                'Halbleiter',
                'Mechatronik - Adaptronik',
                'Mikroelektronik',
                'Robotik',
                'Steuerung - Regelung',
                'Funktechnik - RFID',
                'Hochfrequenztechnologie - Mikrowellen'
            ],
            index: 2
        }
    ]
};

export let Subject7: SingleSubject = {
    title: 'Interdisziplinäres',
    disciplines: [
        {
            disciplineTitle: 'Materialwissenschaften',
            specialties: [
                'Materialwissenschaft',
                'Baumaterialien - Baustoffe',
                'Biomaterialien',
                'Coatings - Oberflächentechnik',
                'Elektronische Materialien',
                'Feine Chemikalien',
                'Funktionelle Materialien - Smart Materials',
                'Keramische Materialien - Glas',
                'Klebstoffe',
                'Korrosionsschutz - Verschleisschutz',
                'Materialbehandlung und -veredelung',
                'Metalle - Legierungen - magnetische Materialien',
                'Nanomaterial - Nanotechnologie',
                'Optische Materialien',
                'Papier - Pappe - Zellstoff',
                'Verbundwerkstoffe',
                'Werkstofftechnik'
            ],
            index: 0
        },
        {
            disciplineTitle: 'Kunststofftechnik',
            specialties: [
                'Extrusion - Folien',
                'Kunststoff - Gummi',
                'Kunststoffmaschinenbau',
                'Kunststofftechnologie',
                'Polymere - Polymerchemie',
                'Spritzgusstechnik - Spritzgussverfahren',
                'Thermoplaste',
                'Duroplaste',
                'Elastomere'
            ],
            index: 1
        },
        {
            disciplineTitle: 'Verfahrenstechnik',
            specialties: [
                'Befestigungstechnik',
                'Fügetechnik - Verbindungstechnik',
                'Leichtbau',
                'Umformverfahren - Umformtechnik',
                'Verfahrenstechnik - Prozesstechnik',
                'Mechanische Verfahrenstechnik, Zerkleiner, Agglomerieren, Mischen, Trennen',
                'Thermische Verfahrenstechnik, Destillation, Rektifikation, Extraktion, Membrantechnik',
                'Chemische Verfahrenstechnik',
                'Elektrochemische Verfahrenstechnik, Synthese, Elektrolytische Raffination, Galvinische Abscheidung',
                'Bioverfahrenstechnik'
            ],
            index: 2
        }
    ]
};

export let allDisciplines: Array<string> = [
    'Verfahrenstechnik',
    'Kunststofftechnik',
    'Volkswirtschaftslehre',
    'Betriebswirtschaft',
    'Rechtswissenschaften',
    'Physik',
    'Chemie',
    'Geowissenschaften',
    'Biologie',
    'Informationswissenschaften',
    'Mathematik',
    'Krankenhaustechnik',
    'Medizinprodukte',
    'Bildgebende Diagnostik',
    'Tissue Engineering',
    'Medizinische Informatik',
    'Maschinenbau',
    'Bauingenieurwesen',
    'Elektrotechnik',
    'Materialwissenschaften'
];

export let allSubjects: Array<string> = [
    'Wirtschaftswissenschaften',
    'Rechtswissenschaften, Jurisprudenz',
    'Naturwissenschaften',
    'Informationswissenschaften und Mathematik',
    'Medizintechnik',
    'Ingenieurswissenschaften',
    'Interdisziplinäres'
];
